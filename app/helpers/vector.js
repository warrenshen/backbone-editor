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

  getCaretOffset() {
    if (this._startPoint.equalsDeeply(this._endPoint)) {
      return this._startPoint.getCaretOffset();
    }
  }

  doesStartBlock() {
    if (this._startPoint.equalsDeeply(this._endPoint)) {
      return this._startPoint.getCaretOffset() === 0;
    }
  }
}


module.exports = Vector;
