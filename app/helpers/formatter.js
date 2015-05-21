class Formatter {

  format(block) {
    var elements = block.get("elements");
    var characters = block.get("content").split("");
    var openers = {};
    var closers = {};
    this.parse(elements, openers, closers);
    return this.merge(characters, openers, closers);
  }

  parse(elements, openers, closers) {
    elements.map(function(element) {
      var start = element.get("start");
      var end = element.get("end");
      var opener = "";
      var closer = "";
      switch (element.get("type")) {
        case "bold":
          opener = "strong";
          closer = "strong";
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

  merge(characters, openers, closers) {
    var content = "";
    for (var i = 0; i < characters.length; i += 1) {
      if (openers[i]) {
        content += openers[i];
      } else if (closers[i]) {
        content += closers[i];
      }
      content += characters[i];
    }
    return content;
  }
}


module.exports = new Formatter();
