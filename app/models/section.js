import Model from "app/templates/model";


class Section extends Model {

  get defaults() {
    return {};
  }

  get name() {
    return "Section";
  }

  get relations() {
    return [];
  }
}


module.exports = Section;
