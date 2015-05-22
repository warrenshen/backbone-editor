import Point from "app/helpers/point";


class Vector {

  constructor(startPoint=new Point(), endPoint=new Point()) {
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
