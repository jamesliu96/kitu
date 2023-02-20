import { configure } from 'mobx';
import { Line } from './geo.js';
import { createCtx, drawLine, drawPoint } from './utils.js';
import { Vec } from './vec.js';
configure({
    enforceActions: 'never',
});
export class Kitu {
    container;
    config;
    static KituError = class extends Error {
        constructor(type = 'KituError', message, options) {
            super(`Kitu.${[type, message].filter(Boolean).join(': ')}`, options);
        }
    };
    static DOMError = class extends Kitu.KituError {
        constructor(message, options) {
            super('DOMError', message, options);
        }
    };
    static ReferenceError = class extends Kitu.KituError {
        constructor(message, options) {
            super('ReferenceError', message, options);
        }
    };
    #ctx;
    get canvas() {
        return this.#ctx.canvas;
    }
    things;
    constructor(container, config, things) {
        this.container = container;
        this.config = config;
        this.things = new Set(things);
        this.#ctx = createCtx(config);
        this.container.appendChild(this.#ctx.canvas);
    }
    #activePoint;
    get activePoint() {
        return this.#activePoint;
    }
    #selectPoint;
    get selectPoint() {
        return this.#selectPoint;
    }
    #mousedown = ({ offsetX: x, offsetY: y }) => {
        this.#activePoint = undefined;
        for (const thing of this.things) {
            if (thing.center.offsetPosNear(new Vec(x, y), 4 * devicePixelRatio))
                this.#activePoint = thing.center;
            else
                for (const point of thing.points)
                    if (point.offsetPosNear(new Vec(x, y), 4 * devicePixelRatio)) {
                        this.#activePoint = point;
                        break;
                    }
            if (this.#activePoint)
                break;
        }
    };
    #mousemove = ({ movementX: dx, movementY: dy }) => {
        if (this.#activePoint)
            this.#activePoint.rotatePos = this.#activePoint.rotatePos.plus(new Vec(dx, dy));
    };
    #mouseup = () => {
        this.#activePoint = undefined;
    };
    #dblclick = ({ offsetX: x, offsetY: y }) => {
        this.#selectPoint = undefined;
        for (const thing of this.things) {
            if (thing.center.offsetPosNear(new Vec(x, y), 4 * devicePixelRatio))
                this.#selectPoint = thing.center;
            else
                for (const point of thing.points)
                    if (point.offsetPosNear(new Vec(x, y), 4 * devicePixelRatio)) {
                        this.#selectPoint = point;
                        break;
                    }
            if (this.#selectPoint)
                break;
        }
    };
    #contextmenu = (e) => {
        e.preventDefault();
        const { offsetX: x, offsetY: y } = e;
        if (this.#selectPoint)
            this.#selectPoint.forces.add(new Vec(x, y).minus(this.#selectPoint.offsetPos));
    };
    #mouseEnabled = false;
    get mouseEnabled() {
        return this.#mouseEnabled;
    }
    enableMouse() {
        if (this.#mouseEnabled)
            throw new Kitu.DOMError('mouse events are already bound');
        this.#ctx.canvas.addEventListener('mousedown', this.#mousedown);
        this.#ctx.canvas.addEventListener('mousemove', this.#mousemove);
        this.#ctx.canvas.addEventListener('mouseup', this.#mouseup);
        this.#ctx.canvas.addEventListener('dblclick', this.#dblclick);
        this.#ctx.canvas.addEventListener('contextmenu', this.#contextmenu);
        this.#mouseEnabled = true;
    }
    disableMouse() {
        this.#ctx.canvas.removeEventListener('mousedown', this.#mousedown);
        this.#ctx.canvas.removeEventListener('mousemove', this.#mousemove);
        this.#ctx.canvas.removeEventListener('mouseup', this.#mouseup);
        this.#ctx.canvas.removeEventListener('dblclick', this.#dblclick);
        this.#ctx.canvas.removeEventListener('contextmenu', this.#contextmenu);
        this.#mouseEnabled = true;
    }
    #raf;
    start() {
        this.stop();
        let t = performance.now();
        const step = () => {
            this.#frame();
            const n = performance.now();
            const dt = (n - t) / 1000;
            this.#frameRate(dt);
            this.#next(dt);
            t = n;
            this.#raf = requestAnimationFrame(step);
        };
        this.#raf = requestAnimationFrame(step);
    }
    stop() {
        if (this.#raf)
            cancelAnimationFrame(this.#raf);
    }
    #frame() {
        const { width, height } = this.canvas;
        this.#ctx.clearRect(0, 0, width, height);
        for (const thing of this.things) {
            for (const triangle of thing.mesh) {
                const { x, y, z, center } = triangle;
                drawLine(this.#ctx, new Line(x, y), 'purple');
                drawLine(this.#ctx, new Line(y, z), 'purple');
                drawLine(this.#ctx, new Line(z, x), 'purple');
                drawPoint(this.#ctx, center, 'purple');
                for (const line of triangle.lines) {
                    drawPoint(this.#ctx, line.center, 'red');
                }
            }
            for (const point of thing.points) {
                for (const force of point.forces) {
                    if (force.mag) {
                        const f = point.offsetPos.plus(force);
                        drawLine(this.#ctx, new Line(point.offsetPos, f), 'yellow');
                        drawPoint(this.#ctx, f, 'yellow');
                    }
                }
                if (point.force.mag) {
                    const f = point.offsetPos.plus(point.force);
                    drawLine(this.#ctx, new Line(point.offsetPos, f), 'orange');
                    drawPoint(this.#ctx, f, 'orange');
                }
                drawPoint(this.#ctx, point.offsetPos, 'blue');
            }
            for (const force of thing.center.forces) {
                if (force.mag) {
                    const f = thing.center.pos.plus(force);
                    drawLine(this.#ctx, new Line(thing.center.pos, f), 'yellow');
                    drawPoint(this.#ctx, f, 'yellow');
                }
            }
            if (thing.center.force.mag) {
                const f = thing.center.pos.plus(thing.center.force);
                drawLine(this.#ctx, new Line(thing.center.pos, f), 'orange');
                drawPoint(this.#ctx, f, 'orange');
            }
            drawPoint(this.#ctx, thing.center.pos, 'transparent', undefined, `${((180 / Math.PI) * thing.rotation).toFixed()}°`, 'green');
        }
    }
    #frameRate(dt) {
        this.#ctx.font = `${12 * devicePixelRatio}px sans-serif`;
        this.#ctx.textAlign = 'left';
        this.#ctx.textBaseline = 'top';
        this.#ctx.fillStyle = 'green';
        this.#ctx.fillText((1 / dt).toFixed(), 0, 0);
    }
    #next(dt) {
        for (const thing of this.things) {
            thing._move(dt);
        }
    }
}
//# sourceMappingURL=kitu.js.map