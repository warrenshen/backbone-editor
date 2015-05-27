import Model from "app/templates/model";

import ModelDirectory from "app/directories/model_directory";

import TypeConstants from "app/constants/type_constants";


class Element extends Model {

  get defaults() {
    return {
      end: 0,
      link: "",
      start: 0,
      type: TypeConstants.element.bold,
    };
  }

  get name() {
    return "Element";
  }

  get relations() {
    return [];
  }
}


module.exports = Element;
