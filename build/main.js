import { Point } from './point.js';
import { Kitu } from './kitu.js';
import { Thing } from './thing.js';
import { Vec } from './vec.js';
const initCenterPos = new Vec(300, 300);
const kitu = new Kitu(document.body, {
    width: 800,
    height: 800,
}, [new Thing(new Point(new Vec(200, 200), [new Vec(0, 1)]))]);
const thingx = new Thing(new Point(initCenterPos), 50, 0, new Vec(), Math.PI / 20);
thingx.points.add(new Point(new Vec(50, 80)));
thingx.points.add(new Point(new Vec(-50, -50)));
thingx.points.add(new Point(new Vec(50, -50)));
thingx.points.add(new Point(new Vec(80, -80)));
kitu.things.add(thingx);
kitu.canvas.style.backgroundColor = '#ccc';
kitu.canvas.style.cursor = 'crosshair';
document.body.appendChild(document.createElement('br'));
const clearBtn = document.createElement('button');
clearBtn.textContent = 'clear';
document.body.appendChild(clearBtn);
clearBtn.addEventListener('click', () => {
    for (const thing of kitu.things) {
        for (const point of thing.points)
            point.forces.clear();
        thing.center.forces.clear();
    }
});
const stopBtn = document.createElement('button');
stopBtn.textContent = 'stop';
document.body.appendChild(stopBtn);
stopBtn.addEventListener('click', () => {
    for (const thing of kitu.things) {
        thing.linearVelocity = new Vec();
        thing.angularVelocity = 0;
    }
});
const resetBtn = document.createElement('button');
resetBtn.textContent = 'reset';
document.body.appendChild(resetBtn);
resetBtn.addEventListener('click', () => {
    for (const thing of kitu.things) {
        thing.center.pos = initCenterPos;
        thing.rotation = 0;
    }
});
const mouse = document.createElement('div');
const active = document.createElement('div');
const select = document.createElement('div');
const xLinearV = document.createElement('div');
const xLinearA = document.createElement('div');
const xAngularV = document.createElement('div');
const xAngularA = document.createElement('div');
document.body.appendChild(mouse);
document.body.appendChild(active);
document.body.appendChild(select);
document.body.appendChild(xLinearV);
document.body.appendChild(xLinearA);
document.body.appendChild(xAngularV);
document.body.appendChild(xAngularA);
setInterval(() => {
    mouse.textContent = `mouse=${kitu.mouseEnabled}`;
    active.textContent = `active=${kitu.activePoint
        ? `[${kitu.activePoint.pos.x},${kitu.activePoint.pos.y}]`
        : null}`;
    select.textContent = `select=${kitu.selectPoint
        ? `[${kitu.selectPoint.pos.x},${kitu.selectPoint.pos.y}]`
        : null}`;
    xLinearV.textContent = `xLinearV=[${thingx.linearVelocity.x},${thingx.linearVelocity.y}]`;
    xLinearA.textContent = `xLinearA=[${thingx.linearAcceleration.x},${thingx.linearAcceleration.y}]`;
    xAngularV.textContent = `xAngularV=${thingx.angularVelocity}`;
    xAngularA.textContent = `xAngularA=${thingx.angularAcceleration}`;
}, 500);
kitu.start();
kitu.enableMouse();
window.kitu = kitu;
//# sourceMappingURL=main.js.map