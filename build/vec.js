import { makeAutoObservable } from 'mobx';
export class Vec {
    x;
    y;
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
        makeAutoObservable(this);
    }
    plus(v) {
        return new Vec(this.x + v.x, this.y + v.y);
    }
    minus(v) {
        return new Vec(this.x - v.x, this.y - v.y);
    }
    mult(n) {
        return new Vec(this.x * n, this.y * n);
    }
    div(n) {
        return this.mult(1 / n);
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    cross(v) {
        return this.x * v.y - this.y * v.x;
    }
    rotate(r) {
        const t = new Vec(Math.sin(r), Math.cos(r));
        return new Vec(this.cross(t), this.dot(t));
    }
    get mag() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
}
//# sourceMappingURL=vec.js.map