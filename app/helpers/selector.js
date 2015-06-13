import Point from "app/helpers/point";
import Vector from "app/helpers/vector";


class Selector {

  createTreeWalker(parentNode) {
    return document.createTreeWalker(
      parentNode,
      NodeFilter.SHOW_TEXT,
      function(childNode) { return NodeFilter.FILTER_ACCEPT },
      false
    );
  }

  findCeilingOffset(contentNode, threshold=10) {
    var range = document.createRange();
    var walker = this.createTreeWalker(contentNode);

    var ceilingOffset = 0;
    var complete = false;
    var top = contentNode.getBoundingClientRect().top;

    while (walker.nextNode() && !complete) {
      var currentNode = walker.currentNode;
      var length = currentNode.textContent.length;

      for (var i = 0; i < length && !complete; i += 1) {
        range.setStart(currentNode, i);
        range.setEnd(currentNode, i + 1);

        if (range.getBoundingClientRect().top - top > threshold) {
          complete = true;
        } else {
          ceilingOffset += 1;
        }
      }
    }

    // Return -1 if node content doesn't even span one line, meaning
    // that the caret should always move up to the preceding block.
    return complete ? ceilingOffset : -1;
  }

  findChildOffset(childNode, parentNode) {
    var walker = this.createTreeWalker(parentNode);
    var offset = 0;

    while (walker.nextNode() && !walker.currentNode.isSameNode(childNode)) {
      offset += walker.currentNode.length;
    }

    return offset;
  }

  findFloorOffset(node, threshold=10) {
    var range = document.createRange();
    var walker = this.createTreeWalker(node);

    var complete = false;
    var floorOffset = 0;
    var bottom = node.getBoundingClientRect().bottom;

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
    var parentNode = childNode.parentNode;

    while (!parentNode.dataset || !parentNode.dataset.index) {
      parentNode = parentNode.parentNode;
    }

    return parentNode;
  }

  generatePoint(selection, type="anchor") {
    var childNode = selection[type + "Node"];

    if (childNode) {
      var parentNode = this.findParentNode(childNode);
      var grandparentNode = parentNode.parentNode;

      var childOffset = this.findChildOffset(childNode, parentNode);
      var caretOffset = childOffset + selection[type + "Offset"];

      var blockIndex = parseInt(parentNode.dataset.index);
      var sectionIndex = parseInt(grandparentNode.dataset.index);

      return new Point(sectionIndex, blockIndex, caretOffset);
    } else {
      return null;
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
