import { makeAutoObservable } from 'mobx';

export class Vec {
  constructor(readonly x = 0, readonly y = 0) {
    makeAutoObservable(this);
  }

  plus(v: Vec) {
    return new Vec(this.x + v.x, this.y + v.y);
  }

  minus(v: Vec) {
    return new Vec(this.x - v.x, this.y - v.y);
  }

  mult(n: number) {
    return new Vec(this.x * n, this.y * n);
  }

  div(n: number) {
    return this.mult(1 / n);
  }

  dot(v: Vec) {
    return this.x * v.x + this.y * v.y;
  }

  cross(v: Vec) {
    return this.x * v.y - this.y * v.x;
  }

  rotate(r: number) {
    const t = new Vec(Math.sin(r), Math.cos(r));
    return new Vec(this.cross(t), this.dot(t));
  }

  get mag() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
}
