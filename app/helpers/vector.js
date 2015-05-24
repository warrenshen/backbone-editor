import Point from "app/helpers/point";


class Vector {

  constructor(startPoint=new Point(), endPoint=new Point()) {
    this._startPoint = startPoint;
    this._endPoint = endPoint;
  }

  get startPoint() {
    return this._startPoint;
  }

  get endPoint() {
    return this._endPoint;
  }
}


module.exports = Vector;
