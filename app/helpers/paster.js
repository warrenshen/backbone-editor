import $ from "jquery";

import Block from "app/models/block";
import Element from "app/models/element";

import EditorStore from "app/stores/editor_store";

import EditorActor from "app/actors/editor_actor";

import TypeConstants from "app/constants/type_constants";


class Paster {

  // TODO: Support empty blocks, that may
  // result from nodes of type div or type p.
  createBlock(node) {
    if (node.nodeName === "IMG") {
      return new Block({
        type: TypeConstants.block.image,
        source: node.src,
      });
    } else if (node.nodeName === "HR") {
      return new Block({ type: TypeConstants.block.divider });
    } else {
      var type = this.findNodeType(node);
      var block = new Block({
        content: node.textContent,
        type: type,
      });

      if (type === TypeConstants.block.standard) {
        var elements = node.childNodes;
        this.createElements(block, elements, 0);
      }

      return block;
    }
  }

  parseContainer(container, point) {
    var sectionIndex = point.sectionIndex;
    var blockIndex = point.blockIndex;

    var currentBlock = EditorStore.currentBlock(sectionIndex, blockIndex);
    var length = currentBlock.length;
    var nodes = $("p, h1, h2, h3, h4, h5, blockquote, img, hr", container);

    if (nodes.length) {
      if (length) {
        $.fn.shift = [].shift;
        var node = nodes.shift();
        var block = this.createBlock(node);

        EditorActor.addBlock(block, point.clone());
        point.blockIndex += 1;
      }

      for (var i = 0; i < nodes.length; i += 1) {
        var node = nodes[i];
        var block = this.createBlock(node);

        EditorActor.addBlock(block, point.clone());
        point.blockIndex += 1;
      }
    } else {
      var elements = container.childNodes;
      var fragment = container.textContent;

      block.addFragment(length, fragment);
      this.createElements(block, elements, length);

      point.caretOffset = length + fragment.length;
      EditorActor.updatePoint(point);
    }
  }

  createElements(block, elements, offset=0) {
    for (var i = 0; i < elements.length; i += 1) {
      var node = elements[i];
      var length = node.textContent.length;
      var element = null;

      if (node.nodeName === "STRONG") {
        element = new Element({ type: TypeConstants.element.bold });
      } else if (node.nodeName === "EM") {
        element = new Element({ type: TypeConstants.element.italic });
      } else if (node.nodeName === "A") {
        var dataset = node.dataset;
        var href = dataset.link ? dataset.link : node.attributes.href.value;
        element = new Element({
          link: href,
          type: TypeConstants.element.link,
        });
      }

      if (element) {
        element.setRange(offset, offset + length);
        block.parseElement(element);
      }

      offset += length;
    }
  }

  findNodeType(node) {
    switch (node.nodeName) {
      case "BLOCKQUOTE":
        return TypeConstants.block.quote;
      case "H1":
        return TypeConstants.block.headingOne;
      case "H2":
        return TypeConstants.block.headingTwo;
      case "H3":
      case "H4":
      case "H5":
        return TypeConstants.block.headingThree;
      default:
        return TypeConstants.block.standard;
    }
  }
}


module.exports = new Paster();
