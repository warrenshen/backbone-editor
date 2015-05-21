import Point from "app/objects/point";
import Vector from "app/objects/vector";


class Vectorizer {

  createTreeWalker(anchorNode) {
    return document.createTreeWalker(
      anchorNode,
      NodeFilter.SHOW_TEXT,
      function(node) { return NodeFilter.FILTER_ACCEPT },
      false
    );
  }

  getParentNode(childNode) {
    var parentNode = childNode;
    while (!node.dataset || !node.dataset.index) {
      parentNode = child.parentNode;
    }
    return parentNode;
  }

  getElementOffset(baseNode, elementNode) {
    var walker = this.createTreeWalker(baseNode);
    var offset = 0;
    while (walker.nextNode()) {
      if (!walker.currentNode.isSameNode(elementNode)) {
        offset += walker.currentNode.length;
      } else {
        return offset;
      }
    }
  }

  createVector(selection) {
    var anchorNode = selection.anchorNode;
    var focusNode = selection.focusNode;

    var anchorParentNode = this.getParentNode(anchorNode);
    var focusParentNode = this.getParentNode(focusNode);

    var anchorSectionNode = anchorParentNode.parentNode;
    var focusSectionNode = focusParentNode.parentNode;

    var anchorElementOffset = this.getElementOffset(anchorParentNode, anchorNode);
    var focusElementOffset = this.getElementOffset(focusParentNode, focusNode);

    var anchorCharOffset = anchorElementOffset + selection.anchorOffset;
    var focusCharOffset = focusElementOffset + selection.focusOffset;

    var anchorSectionIndex = parseInt(anchorSectionNode.dataset.index);
    var focusSectionIndex = parseInt(focusSectionNode.dataset.index);

    var anchorBlockIndex = parseInt(anchorParentNode.dataset.index);
    var focusBlockIndex = parseInt(focusParentNode.dataset.index);

    var anchorPoint = new Point(anchorSectionIndex, anchorBlockIndex, anchorCharOffset);
    var focusPoint = new Point(focusSectionIndex, focusBlockIndex, focusCharOffset);

    if (anchorPoint.compareTo(focusPoint) < 0) {
      return new Vector(anchorPoint, focusPoint);
    } else {
      return new Vector(focusPoint, anchorPoint);
    }
  }
}


module.exports = Vectorizer;
