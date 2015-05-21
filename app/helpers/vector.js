class Vector {

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
