import _ from "lodash";
import CookiesJS from "cookies-js";

import Store from "app/templates/store";

import Block from "app/models/block";
import Element from "app/models/element";
import Section from "app/models/section";
import Story from "app/models/story";

import Point from "app/helpers/point";
import Vector from "app/helpers/vector";

import ActionConstants from "app/constants/action_constants";
import TypeConstants from "app/constants/type_constants";


class EditorStore extends Store {

  // --------------------------------------------------
  // Setup
  // --------------------------------------------------
  setDefaults() {
    this._link = null;
    this._point = new Point(0, 0);
    this._story = this.retrieveCookies();
    this._styles = {};
    this._vector = null;
  }

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
  get styles() {
    return this._styles;
  }

  get link() {
    return this._link;
  }

  get name() {
    return "EditorStore";
  }

  get point() {
    return this._point;
  }

  get story() {
    return this._story;
  }

  get vector() {
    return this._vector;
  }

  // --------------------------------------------------
  // Methods
  // --------------------------------------------------
  callBlocks(vector, callback, shouldRemove=false) {
    var startPoint = vector.startPoint;
    var endPoint = vector.endPoint;
    var startSectionIndex = startPoint.sectionIndex;
    var endSectionIndex = endPoint.sectionIndex;
    var startBlockIndex = startPoint.blockIndex;
    var endBlockIndex = endPoint.blockIndex;
    var startCaretOffset = startPoint.caretOffset;
    var endCaretOffset = endPoint.caretOffset;
    var sectionBucket = [];
    var sectionIndices = _.range(startSectionIndex, endSectionIndex + 1);
    for (var sectionIndex of sectionIndices) {
      var point = new Point(sectionIndex, 0);
      var section = this.getSection(point);
      var blockIndices = false;
      if (startSectionIndex === endSectionIndex) {
        blockIndices = _.range(startBlockIndex, endBlockIndex + 1);
      } else if (sectionIndex === startSectionIndex) {
        blockIndices = _.range(startBlockIndex, section.length);
      } else if (sectionIndex === endSectionIndex) {
        blockIndices = _.range(0, endBlockIndex + 1);
      } else {
        if (shouldRemove) {
          sectionBucket.push(section);
        } else {
          blockIndices = _.range(0, section.length);
        }
      }
      if (blockIndices) {
        var blockBucket = [];
        for (var blockIndex of blockIndices) {
          point.blockIndex = blockIndex;
          var block = this.getBlock(point);
          if (startSectionIndex === endSectionIndex &&
              blockIndices[0] === blockIndices[blockIndices.length - 1]) {
            callback(block, startCaretOffset, endCaretOffset);
          } else if (sectionIndex === startSectionIndex &&
                     blockIndex === blockIndices[0]) {
            callback(block, startCaretOffset, block.length);
          } else if (sectionIndex === endSectionIndex &&
                     blockIndex === blockIndices[blockIndices.length - 1]) {
            callback(block, 0, endCaretOffset);
          } else {
            if (shouldRemove) {
              blockBucket.push(block);
            } else {
              callback(block, 0, block.length);
            }
          }
        }
        for (var block of blockBucket) {
          section.removeBlock(block);
        }
      }
    }
    for (var section of sectionBucket) {
      this._story.removeSection(section);
    }
  }

  filterStyles(vector) {
    var maps = [];
    var styles = {};
    var callback = function(block, start, end) {
      var map = block.filterStyles(start, end);
      maps.push(map);
    };
    this.callBlocks(vector, callback);
    for (var map of maps) {
      for (var [type, value] of map) {
        if (value && type === TypeConstants.block.list &&
            !styles["shouldHideOptions"]) {
          styles["shouldHideOptions"] = true;
        } else {
          if (!value && (styles[type] || styles[type] === undefined)) {
            styles[type] = false;
          } else if (value && styles[type] === undefined) {
            styles[type] = true;
          }
        }
      }
    }
    return styles;
  }

  getBlock(point) {
    return this.getSection(point).get("blocks").at(point.blockIndex);
  }

  getPrevious(point) {
    if (point.blockIndex) {
      point.blockIndex -= 1;
      return this.getBlock(point);
    } else if (point.sectionIndex) {
      point.sectionIndex -= 1;
      var section = this.getSection(point);
      point.blockIndex = section.length - 1;
      return this.getBlock(point);
    } else {
      return false;
    }
  }

  getSection(point) {
    return this._story.get("sections").at(point.sectionIndex);
  }

  // --------------------------------------------------
  // Actions
  // --------------------------------------------------
  addSection(point, options) {
    var story = this._story;
    var section = this.getSection(point);
    var block = this.getBlock(point);
    var type = options.type;
    var clone = section.cloneDestructively(point.blockIndex + 1);
    var addition = section.cloneDestructively(point.blockIndex);
    addition.set("type", type);
    story.addSection(addition, point.sectionIndex + 1);
    if (addition.isList()) {
      block.set("type", TypeConstants.block.list);
      block.set("content", block.get("content").substring(3));
    } else {
      block.set("type", TypeConstants.block.paragraph);
    }
    if (clone.length) {
      story.addSection(clone, point.sectionIndex + 2);
    }
    if (!section.length) {
      story.removeSection(section);
    }
    point.sectionIndex = block.get("section_index");
    point.blockIndex = block.get("index");
    point.caretOffset = 0;
    this.updatePoint(point);
    this.resetCookies();
  }

  changeBlock(point, options) {
    var block = this.getBlock(point);
    block.set({
      source: options.source,
      type: options.type,
    });
    if (block.isLast()) {
      var section = this.getSection(point);
      section.addBlock(new Block(), section.length);
    }
    if (!block.isEditable()) {
      point.blockIndex += 1;
    }
    this.updatePoint(point);
    this.resetCookies();
  }

  removeBlock(point) {
    var section = this.getSection(point);
    var block = this.getBlock(point);
    var clone = point.clone();
    var previous = this.getPrevious(point.clone());
    if (block.isList()) {
      this.addSection(point, { type: TypeConstants.section.standard });
    } else if (!previous) {
      if (block.isImage()) {
        block.set({
          content: "",
          type: TypeConstants.block.paragraph,
        });
        if (!block.isLast()) {
          section.removeBlock(block);
        }
      } else {
        this.updatePoint(point);
      }
    } else {
      if (previous.isImage()) {
        if (!block.length && !block.isLast()) {
          section.removeBlock(block);
        }
      } else {
        point.sectionIndex = previous.get("section_index");
        point.blockIndex = previous.get("index");
        point.caretOffset = previous.length;
        if (!block.isImage() && !previous.isEditable()) {
          section.removeBlock(previous);
        } else {
          previous.mergeBlock(block, previous.length);
          section.removeBlock(block);
        }
      }
      this._story.mergeSections();
      this.updatePoint(point);
      this.resetCookies();
    }
  }

  removeBlocks(vector, options={}) {
    var startPoint = vector.startPoint;
    var endPoint = vector.endPoint;
    var block = this.getBlock(endPoint);
    var callback = function(block, start, end) {
      block.removeFragment(start, end);
    };
    this.callBlocks(vector, callback, true);
    if (options.enter) {
      this.splitBlock(startPoint);
    } else {
      if (options.character) {
        this.getBlock(startPoint).addFragment(
          options.character,
          startPoint.caretOffset
        );
        startPoint.caretOffset += 1;
      }
      if (startPoint.compareShallowly(endPoint)) {
        var point = new Point(
          block.get("section_index"),
          block.get("index")
        );
        this.removeBlock(point);
      } else {
        this.updatePoint(startPoint);
      }
    }
    this.resetCookies();
  }

  retrieveCookies() {
    if (false && CookiesJS.enabled) {
      var data = "";
      for (var i = 0; i < 20; i += 1) {
        var cookie = CookiesJS.get("cookie" + i);
        data += cookie ? cookie : "";
      }
      if (data) {
        var json = JSON.parse(data);
        return new Story(json);
      }
    }
    var story = new Story();
    var section = new Section();
    section.addBlock(new Block());
    story.addSection(section);
    return story;
  }

  resetCookies() {
    if (false && CookiesJS.enabled) {
      var data = JSON.stringify(this._story.toJSON());
      for (var i = 0; i < 20; i += 1) {
        var length = data.length;
        if (length > 2500) {
          CookiesJS.set("cookie" + i, data.substring(0, 2500));
          data = data.substring(2500);
        } else {
          CookiesJS.set("cookie" + i, data);
          data = "";
        }
      }
    }
  }

  selectAll() {
    var startPoint = new Point(0, 0);
    var endPoint = new Point(this._story.length - 1, 0);
    endPoint.blockIndex = this.getSection(endPoint).length - 1;
    var block = this.getBlock(endPoint);
    while (!block.length) {
      block = this.getPrevious(endPoint);
    }
    endPoint.caretOffset = block.length;
    this.updateVector(new Vector(startPoint, endPoint));
  }

  splitBlock(point) {
    var section = this.getSection(point);
    var block = this.getBlock(point);
    if (!block.length && block.isList()) {
      this.addSection(point, { type: TypeConstants.section.standard });
    } else {
      var clone = block.cloneDestructively(point.caretOffset);
      point.blockIndex += 1;
      point.caretOffset = 0;
      section.addBlock(clone, point.blockIndex);
      this.updatePoint(point);
      this.resetCookies();
    }
  }

  styleBlocks(vector, options) {
    var type = options.type;
    var callback = function(block, start, end) {
      if (type === TypeConstants.block.centered) {
        block.set("is_centered", !block.isCentered());
      } else {
        block.set("type", block.get("type") === type ?
                          TypeConstants.block.paragraph :
                          type);
      }
    };
    this.callBlocks(vector, callback);
    this.updateStyles(vector);
    this.resetCookies();
  }

  styleElements(vector, options) {
    var callback = function(block, start, end) {
      var element = new Element({ type: options.type, url: options.url });
      element.setOffsets(start, end);
      block.parseElement(element);
    };
    this.callBlocks(vector, callback);
    if (options.url) {
      this.updatePoint(vector.endPoint);
    } else {
      this.updateStyles(vector);
    }
    this.resetCookies();
  }

  updateLink(link) {
    this._link = link;
  }

  updatePoint(point) {
    this._point = point;
    this._vector = null;
    this._styles = {};
  }

  updateStyles(vector) {
    this._styles = vector ? this.filterStyles(vector) : {};
  }

  updateVector(vector) {
    this._point = null;
    this._vector = vector;
    this.updateStyles(vector);
  }

  // --------------------------------------------------
  // Dispatch
  // --------------------------------------------------
  handleDispatch(payload) {
    var action = payload.action;
    switch (action.type) {
      case ActionConstants.editor.addSection:
        return this.addSection(action.point, action.options);
      case ActionConstants.editor.changeBlock:
        return this.changeBlock(action.point, action.options);
      case ActionConstants.editor.removeBlock:
        return this.removeBlock(action.point);
      case ActionConstants.editor.removeBlocks:
        return this.removeBlocks(action.vector, action.options);
      case ActionConstants.editor.resetCookies:
        return this.resetCookies();
      case ActionConstants.editor.selectAll:
        return this.selectAll();
      case ActionConstants.editor.splitBlock:
        return this.splitBlock(action.point);
      case ActionConstants.editor.styleBlocks:
        return this.styleBlocks(action.vector, action.options);
      case ActionConstants.editor.styleElements:
        return this.styleElements(action.vector, action.options);
      case ActionConstants.editor.updateLink:
        return this.updateLink(action.link);
      case ActionConstants.editor.updatePoint:
        return this.updatePoint(action.point);
      case ActionConstants.editor.updateVector:
        return this.updateVector(action.vector);
    };
  }
}


module.exports = new EditorStore();
