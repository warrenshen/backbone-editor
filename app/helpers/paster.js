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
      case TypeConstants.node.paragraph:
        return TypeConstants.block.paragraph;
      case TypeConstants.node.quote:
        return TypeConstants.block.quote;
      case TypeConstants.node.span:
        return TypeConstants.block.paragraph;
      default:
        return false;
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
    if (type) {
      var block = new Block({
        content: node.textContent ? node.textContent : "",
        is_centered: node.style.textAlign === "center",
        source: node.src ? node.src : "",
        type: type,
      });
      if (block.isParagraph()) {
        var elements = node.childNodes;
        this.createElements(block, elements);
      }
      return block;
    } else {
      return false;
    }
  }

  createElements(block, elements) {
    var offset = 0;
    for (var i = 0; i < elements.length; i += 1) {
      var node = elements[i];
      var length = node.textContent.length;
      var type = this.classifyElement(node);
      if (type) {
        var element = new Element({ type: type });
        if (element.isLink()) {
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
    var startBlock = EditorStore.getBlock(point);
    var nodes = $("blockquote, h1, h2, h3, h4, h5, " +
                  "img, hr, p, span", container);
    if (!nodes.length) {
      return false;
    } else {
      var clone = false;
      $.fn.shift = [].shift;
      var node = nodes.shift();
      var block = this.createBlock(node);
      if (block) {
        clone = startBlock.cloneDestructively(point.caretOffset);
        if (!startBlock.length) {
          startBlock.set("type", block.get("type"));
          startBlock.set("is_centered", block.isCentered());
          console.log("hello");
        }
        block = startBlock.mergeBlock(block, point.clone());
        point.blockIndex += 1;
      }
      for (var i = 0; i < nodes.length; i += 1) {
        var node = nodes[i];
        block = this.createBlock(node);
        if (block) {
          EditorStore.addBlock(
            point.clone(),
            { block: block, shouldIgnore: true }
          );
          point.blockIndex += 1;
        }
      }
      if (block) {
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
