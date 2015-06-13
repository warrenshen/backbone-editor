import Point from "app/helpers/point";


class Vector {

  // --------------------------------------------------
  // Setup
  // --------------------------------------------------
  constructor(startPoint, endPoint) {
    this._startPoint = startPoint;
    this._endPoint = endPoint;
  }

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
  get startPoint() {
    return this._startPoint;
  }

  get endPoint() {
    return this._endPoint;
  }
}


module.exports = Vector;
