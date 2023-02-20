import { autorun, makeAutoObservable } from 'mobx';
import { Triangle } from './geo.js';
import { Point } from './point.js';
import { Vec } from './vec.js';
export class Thing {
    center;
    mass;
    rotation;
    linearVelocity;
    angularVelocity;
    points;
    constructor(center = new Point(), mass = 1, rotation = 0, linearVelocity = new Vec(), angularVelocity = 0, points) {
        this.center = center;
        this.mass = mass;
        this.rotation = rotation;
        this.linearVelocity = linearVelocity;
        this.angularVelocity = angularVelocity;
        this.points = new Set(points);
        makeAutoObservable(this);
        autorun(() => {
            for (const p of this.points) {
                p._thing = this;
            }
        });
    }
    get mesh() {
        const { points: [...points], } = this;
        const mesh = [];
        for (let i = 0; i < points.length - 2; i++) {
            for (let j = i + 1; j < points.length - 1; j++) {
                for (let k = j + 1; k < points.length; k++) {
                    mesh.push(new Triangle(points[i].offsetPos, points[j].offsetPos, points[k].offsetPos));
                }
            }
        }
        return mesh;
    }
    get linearAcceleration() {
        return [...this.points]
            .reduce((acc, { pos: { mag }, rotatePos, rotatePoint: { linearForce } }) => {
            return acc.plus(rotatePos.div(mag).mult(linearForce));
        }, new Vec())
            .plus(this.center.force)
            .div(this.mass);
    }
    get angularAcceleration() {
        return ([...this.points].reduce((acc, { pos: { mag }, rotatePoint: { angularForce } }) => {
            return acc + angularForce / mag;
        }, 0) / this.mass);
    }
    _move(dt) {
        this.linearVelocity = this.linearVelocity.plus(this.linearAcceleration.mult(dt));
        this.center.pos = this.center.pos.plus(this.linearVelocity.mult(dt));
        this.angularVelocity += this.angularAcceleration * dt;
        this.rotation += this.angularVelocity * dt;
    }
}
//# sourceMappingURL=thing.js.map