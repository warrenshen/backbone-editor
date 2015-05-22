import Point from "app/helpers/point";
import Vector from "app/helpers/vector";


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
    while (!parentNode.dataset || !parentNode.dataset.index) {
      parentNode = parentNode.parentNode;
    }
    return parentNode;
  }

  getElementOffset(blockNode, elementNode) {
    var walker = this.createTreeWalker(blockNode);
    var offset = 0;
    while (walker.nextNode()) {
      if (!walker.currentNode.isSameNode(elementNode)) {
        offset += walker.currentNode.length;
      } else {
        return offset;
      }
    }
  }

  generateVector(selection) {
    var anchorNode = selection.anchorNode;
    var focusNode = selection.focusNode;

    var anchorParentNode = this.getParentNode(anchorNode);
    var focusParentNode = this.getParentNode(focusNode);

    var anchorSectionNode = anchorParentNode.parentNode;
    var focusSectionNode = focusParentNode.parentNode;

    var anchorElementOffset = this.getElementOffset(anchorParentNode, anchorNode);
    var focusElementOffset = this.getElementOffset(focusParentNode, focusNode);

    var anchorCaretOffset = anchorElementOffset + selection.anchorOffset;
    var focusCaretOffset = focusElementOffset + selection.focusOffset;

    var anchorSectionIndex = parseInt(anchorSectionNode.dataset.index);
    var focusSectionIndex = parseInt(focusSectionNode.dataset.index);

    var anchorBlockIndex = parseInt(anchorParentNode.dataset.index);
    var focusBlockIndex = parseInt(focusParentNode.dataset.index);

    var anchorPoint = new Point(anchorSectionIndex, anchorBlockIndex, anchorCaretOffset);
    var focusPoint = new Point(focusSectionIndex, focusBlockIndex, focusCaretOffset);

    if (anchorPoint.compareDeeply(focusPoint) < 0) {
      return new Vector(anchorPoint, focusPoint);
    } else {
      return new Vector(focusPoint, anchorPoint);
    }
  }
}


module.exports = new Vectorizer();
