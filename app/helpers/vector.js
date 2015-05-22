import Point from "app/helpers/point";


class Vector {

  constructor() {
    this(new Point(0, 0), new Point(0, 0));
  }

  constructor(startPoint, endPoint) {
    this._startPoint = startPoint;
    this._endPoint = endPoint;
  }

  getStartPoint() {
    return this._startPoint;
  }

  getEndPoint() {
    return this._endPoint;
  }
}


module.exports = Vector;
