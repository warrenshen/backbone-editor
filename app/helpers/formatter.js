import TypeConstants from "app/constants/type_constants";


class Formatter {

  formatBlock(block) {
    var elements = block.get("elements");
    var characters = block.get("content").split("");

    var openers = {};
    var closers = {};

    this.parseElements(elements, openers, closers);
    return this.mergeElements(characters, openers, closers);
  }

  parseElements(elements, openers, closers) {
    elements.map(function(element) {
      var start = element.get("start");
      var end = element.get("end");

      var opener = "";
      var closer = "";

      switch (element.get("type")) {
        case TypeConstants.element.bold:
          opener = "strong";
          closer = "strong";
          break;
        case TypeConstants.element.italic:
          opener = "i";
          closer = "i";
          break;
        case TypeConstants.element.link:
          opener = "span class=\"element-link\" data-link=\"" + element.get("link") + "\"";
          closer = "span";
          break;
      }

      if (openers[start]) {
        openers[start].push("<" + opener + ">");
      } else {
        openers[start] = ["<" + opener + ">"]
      }

      if (closers[end]) {
        closers[end].push("</" + closer +">");
      } else {
        closers[end] = ["</" + closer + ">"];
      }
    });
  }

  mergeElements(characters, openers, closers) {
    var content = "";

    for (var i = 0; i < characters.length; i += 1) {
      // .join("") concatenates multiple tags together.
      if (closers[i]) {
        content += closers[i].join("");
      }

      if (openers[i]) {
        content += openers[i].join("");
      }

      content += (characters[i] === " ") ? "&nbsp;" : characters[i];
    }

    return content;
  }
}


module.exports = new Formatter();
