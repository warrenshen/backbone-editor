import Model from "app/templates/model";


class Block extends Model {

  get defaults() {
    return {};
  }

  get name() {
    return "Block";
  }

  get relations() {
    return [];
  }
}


module.exports = Block;
