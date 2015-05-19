import Model from "app/templates/model";


class Element extends Model {

  get defaults() {
    return {};
  }

  get name() {
    return "Element";
  }

  get relations() {
    return [];
  }
}


module.exports = Element;
