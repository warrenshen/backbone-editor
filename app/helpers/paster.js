import $ from "jquery";

import Block from "app/models/block";
import Element from "app/models/element";

import EditorStore from "app/stores/editor_store";

import TypeConstants from "app/constants/type_constants";


class Paster {

  classifyBlock(node) {
    switch (node.nodeName) {
      case TypeConstants.node.divider:
        return TypeConstants.block.divider;
      case TypeConstants.node.headingOne:
        return TypeConstants.block.headingOne;
      case TypeConstants.node.headingTwo:
        return TypeConstants.block.headingTwo;
      case TypeConstants.node.headingThree:
      case TypeConstants.node.headingFour:
      case TypeConstants.node.headingFive:
        return TypeConstants.block.headingThree;
      case TypeConstants.node.image:
        return TypeConstants.block.image;
      case TypeConstants.node.quote:
        return TypeConstants.block.quote;
      default:
        return TypeConstants.block.standard;
    }
  }

  classifyElement(node) {
    switch (node.nodeName) {
      case TypeConstants.node.bold:
        return TypeConstants.element.bold;
      case TypeConstants.node.italic:
        return TypeConstants.element.italic;
      case TypeConstants.node.link:
        return TypeConstants.element.link;
      default:
        return false;
    }
  }

  createBlock(node) {
    var type = this.classifyBlock(node);
    var block = new Block({
      content: node.textContent ? node.textContent : "",
      is_centered: node.style.textAlign === "center",
      source: node.src ? node.src : "",
      type: type,
    });
    if (type === TypeConstants.block.standard) {
      var elements = node.childNodes;
      this.createElements(block, elements);
    }
    return block;
  }

  createElements(block, elements) {
    var offset = 0;
    for (var i = 0; i < elements.length; i += 1) {
      var node = elements[i];
      var length = node.textContent.length;
      var type = this.classifyElement(node);
      if (type) {
        var element = new Element({ type: type });
        if (type === TypeConstants.node.link) {
          var attributes = node.attributes;
          var dataset = node.dataset;
          var url = dataset.link ? dataset.link : attributes.href.value;
          element.set("url", url);
        }
        element.setOffsets(offset, offset + length);
        block.parseElement(element);
      }
      offset += length;
    }
  }

  parseContainer(container, point) {
    var anchor = EditorStore.getBlock(
      point.sectionIndex,
      point.blockIndex
    );
    var nodes = $("blockquote, h1, h2, h3, h4, h5, " +
                  "img, hr, p, span", container);
    if (!nodes.length) {
      return false;
    } else {
      var block = null;
      var clone = null;
      $.fn.shift = [].shift;
      var node = nodes.shift();
      block = this.createBlock(node);
      clone = anchor.destructiveClone(point.caretOffset);
      if (!anchor.length) {
        anchor.set("type", block.get("type"));
      }
      block = anchor.mergeBlock(block, point.clone());
      point.blockIndex += 1;
      for (var i = 0; i < nodes.length; i += 1) {
        var node = nodes[i];
        block = this.createBlock(node);
        EditorStore.addBlock(block, point.clone());
        point.blockIndex += 1;
      }
      if (clone) {
        block.mergeBlock(clone, block.length);
      }
      point.blockIndex -= 1;
      point.caretOffset = block.length;
      EditorStore.updatePoint(point);
      return true;
    }
  }
}


module.exports = new Paster();
