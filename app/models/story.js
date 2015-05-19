import Model from "app/templates/model";


class Story extends Model {

  get defaults(){
    return {};
  }

  get name() {
    return "Story";
  }

  get relations() {
    return [];
  }
}


module.exports = Story;
