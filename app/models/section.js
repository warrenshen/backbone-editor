import Model from "app/templates/model";


class Section extends Model {

  get defaults() {
    return {};
  }

  get name() {
    return "Section";
  }

  get relations() {
    return [
      {
        type: "HasMany",
        key: "blocks",
        relatedModel: ModelDirectory.get("Block"),
      },
    ];
  }
}


module.exports = Section;
