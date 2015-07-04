import Point from "app/helpers/point";
import Vector from "app/helpers/vector";


class Selector {

  createTreeWalker(parentNode) {
    return document.createTreeWalker(
      parentNode,
      NodeFilter.SHOW_TEXT,
      function(childNode) {
        return NodeFilter.FILTER_ACCEPT;
      },
      false
    );
  }

  findChildOffset(childNode, parentNode) {
    var offset = 0;
    var walker = this.createTreeWalker(parentNode);
    while (walker.nextNode() &&
           !walker.currentNode.isSameNode(childNode)) {
      offset += walker.currentNode.length;
    }
    return offset;
  }

  findParentNode(childNode) {
    var parentNode = childNode;
    while (parentNode &&
           (!parentNode.dataset ||
           !parentNode.dataset.index)) {
      parentNode = parentNode.parentNode;
    }
    return parentNode;
  }

  generatePoint(selection, type="anchor") {
    var childNode = selection[type + "Node"];
    if (childNode) {
      var parentNode = this.findParentNode(childNode);
      if (parentNode) {
        var grandparentNode = parentNode.parentNode;
        var childOffset = this.findChildOffset(childNode, parentNode);
        var caretOffset = childOffset + selection[type + "Offset"];
        var blockIndex = parseInt(parentNode.dataset.index);
        var sectionIndex = parseInt(grandparentNode.dataset.index);
        return new Point(sectionIndex, blockIndex, caretOffset);
      }
    } else {
      return false;
    }
  }

  generateVector(selection) {
    var anchorPoint = this.generatePoint(selection);
    var focusPoint = this.generatePoint(selection, "focus");
    if (anchorPoint.compareDeeply(focusPoint) < 0) {
      return new Vector(anchorPoint, focusPoint);
    } else {
      return new Vector(focusPoint, anchorPoint);
    }
  }
}


module.exports = new Selector();
