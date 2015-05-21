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

    var anchorGrandparentNode = anchorParentNode.parentNode;
    var focusGrandparentNode = focusParentNode.parentNode;

    var anchorElementOffset = this.getElementOffset(anchorParentNode, anchorNode);
    var focusElementOffset = this.getElementOffset(focusParentNode, focusNode);

    anchorElementOffset += selection.anchorOffset;
    focusElementOffset += selection.focusOffset;

    var sectionDifference = parseInt(anchorGrandparentNode.dataset.index) -
                            parseInt(focusGrandparentNode.dataset.index);
    var blockDifference = parseInt(anchorParentNode.dataset.index) -
                          parseInt(focusParentNode.dataset.index);
  }
}
