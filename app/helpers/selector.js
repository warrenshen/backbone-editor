import Point from "app/helpers/point";
import Vector from "app/helpers/vector";


class Selector {

  createTreeWalker(anchorNode) {
    return document.createTreeWalker(
      anchorNode,
      NodeFilter.SHOW_TEXT,
      function(node) { return NodeFilter.FILTER_ACCEPT },
      false
    );
  }

  findCeilingOffset(node) {
    var range = document.createRange();
    var walker = this.createTreeWalker(node);

    var ceilingOffset = 0;
    var top = node.getBoundingClientRect().top;

    var complete = false;
    while (walker.nextNode() && !complete) {
      var currentNode = walker.currentNode;
      var length = currentNode.textContent.length;
      for (var i = 0; i < length && !complete; i += 1) {
        range.setStart(currentNode, i);
        range.setEnd(currentNode, i + 1);
        if (range.getBoundingClientRect().top - top > 10) {
          complete = true;
        } else {
          ceilingOffset += 1;
        }
      }
    }

    if (complete) {
      return ceilingOffset;
    } else {
      // Return -1 if node content doesn't even span one line, meaning
      // that the caret should always move up to the preceding block.
      return -1;
    }
  }

  findElementOffset(blockNode, elementNode) {
    var walker = this.createTreeWalker(blockNode);
    var offset = 0;
    while (walker.nextNode() && !walker.currentNode.isSameNode(elementNode)) {
      offset += walker.currentNode.length;
    }
    return offset;
  }

  findFloorOffset(node, threshold=10) {
    var range = document.createRange();
    var walker = this.createTreeWalker(node);

    var floorOffset = 0;
    var bottom = node.getBoundingClientRect().bottom;

    var complete = false;
    while (walker.nextNode() && !complete) {
      var currentNode = walker.currentNode;
      var length = currentNode.textContent.length;
      for (var i = 0; i < length && !complete; i += 1) {
        range.setStart(currentNode, i);
        range.setEnd(currentNode, i + 1);
        if (bottom - range.getBoundingClientRect().bottom < threshold) {
          complete = true;
        } else {
          floorOffset += 1;
        }
      }
    }

    return floorOffset;
  }

  findParentNode(childNode) {
    var parentNode = childNode;
    while (!parentNode.dataset || !parentNode.dataset.index) {
      parentNode = parentNode.parentNode;
    }
    return parentNode;
  }

  generatePoint(selection, type="anchor") {
    var node = selection[type + "Node"];
    var parentNode = this.findParentNode(node);
    var grandparentNode = parentNode.parentNode;

    var elementOffset = this.findElementOffset(parentNode, node);
    var caretOffset = elementOffset + selection[type + "Offset"];

    var blockIndex = parseInt(parentNode.dataset.index);
    var sectionIndex = parseInt(grandparentNode.dataset.index);

    return new Point(sectionIndex, blockIndex, caretOffset);
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
