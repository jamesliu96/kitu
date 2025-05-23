import { makeAutoObservable } from 'mobx';
import { Thing } from './thing.js';
import { Vec } from './vec.js';

export class Point {
  private _thing?: Thing;
  get rotatePos() {
    return this._thing ? this.pos.rotate(this._thing.rotation) : this.pos;
  }
  set rotatePos(v) {
    this.pos = this._thing ? v.rotate(-this._thing.rotation) : v;
  }
  get offsetPos() {
    return this._thing ? this.rotatePos.plus(this._thing.center.pos) : this.pos;
  }
  set offsetPos(v) {
    this.rotatePos = this._thing ? v.minus(this._thing?.center.pos) : v;
  }
  get rotatePoint() {
    return new Point(this.rotatePos, this.forces);
  }
  get offsetPoint() {
    return new Point(this.offsetPos, this.forces);
  }

  forces: Set<Vec>;

  constructor(public pos = new Vec(0, 0), forces?: Iterable<Vec>) {
    this.forces = new Set(forces);
    makeAutoObservable(this);
  }

  get force() {
    return [...this.forces].reduce((acc, cur) => acc.plus(cur), new Vec());
  }

  reduceForce() {
    const { force } = this;
    this.forces.clear();
    this.forces.add(force);
  }

  get linearForce() {
    return this.pos.dot(this.force) / this.pos.mag;
  }

  get angularForce() {
    return this.pos.cross(this.force) / this.pos.mag;
  }

  offsetPosNear(v: Vec, dist = 0) {
    return this.offsetPos.minus(v).mag <= dist;
  }
}
