import { makeAutoObservable } from 'mobx';
import { Vec } from './vec.js';
export class Line {
    a;
    b;
    constructor(a, b) {
        this.a = a;
        this.b = b;
        makeAutoObservable(this);
    }
    get center() {
        return this.a.plus(this.b).div(2);
    }
}
export class Triangle {
    x;
    y;
    z;
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        makeAutoObservable(this);
    }
    get center() {
        return new Vec((this.x.x + this.y.x + this.z.x) / 3, (this.x.y + this.y.y + this.z.y) / 3);
    }
    get lines() {
        return [
            new Line(this.x, this.y),
            new Line(this.y, this.z),
            new Line(this.z, this.x),
        ];
    }
    in(v) {
        const vx = this.x.minus(v);
        const vy = this.y.minus(v);
        const vz = this.z.minus(v);
        const t1 = vx.cross(vy);
        const t2 = vy.cross(vz);
        const t3 = vz.cross(vx);
        return t1 * t2 >= 0 && t1 * t3 >= 0 && t2 * t3 >= 0;
    }
}
//# sourceMappingURL=geo.js.map