import React from "react";

import TypeConstants from "app/constants/type_constants";


class Formatter {

  parseElements(elements) {
    var openers = {};
    var closers = {};
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
          opener = "span class=\"element-link\" " +
                   "data-link=\"" + element.get("url") + "\"";
          closer = "span";
          break;
      }
      if (openers[start]) {
        openers[start].push("<" + opener + ">");
      } else {
        openers[start] = ["<" + opener + ">"]
      }
      if (closers[end]) {
        closers[end].unshift("</" + closer +">");
      } else {
        closers[end] = ["</" + closer + ">"];
      }
    });
    return [openers, closers];
  }

  mergeCode(characters, openers, closers) {
    var index = -1;
    var nodes = [];
    var string = "";
    var helper = function(style, content) {
      index += 1;
      string = "";
      return (
        <span className={style} key={index}>
          {content}
        </span>
      );
    };
    for (var i = 0; i < characters.length; i += 1) {
      if (closers[i]) {
        if (string) {
          nodes.push(helper("code", string));
        }
        nodes.push(helper("code code-rose", closers[i].join("")));
      }
      if (openers[i]) {
        if (string) {
          nodes.push(helper("code", string));
        }
        nodes.push(helper("code code-rose", openers[i].join("")));
      }
      string += characters[i];
      if (i === characters.length - 1 && string) {
        nodes.push(helper("code", string));
      }
    }
    return nodes;
  }

  mergeStrings(characters, openers, closers) {
    var content = "";
    for (var i = 0; i < characters.length; i += 1) {
      if (closers[i]) {
        content += closers[i].join("");
      }
      if (openers[i]) {
        content += openers[i].join("");
      }
      content += characters[i];
    }
    return content;
  }

  stringifyBlock(block) {
    var elements = block.get("elements");
    var characters = block.get("content").split("");
    var sets = this.parseElements(elements);
    return this.mergeStrings(characters, sets[0], sets[1]);
  }

  codifyBlock(block) {
    var elements = block.get("elements");
    var characters = block.get("content").split("");
    var sets = this.parseElements(elements);
    return this.mergeCode(characters, sets[0], sets[1]);
  }
}


module.exports = new Formatter();
