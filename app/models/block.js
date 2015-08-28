import Model from 'app/templates/model';

import Formatter from 'app/helpers/formatter';

import ModelDirectory from 'app/directories/model_directory';

import TypeConstants from 'app/constants/type_constants';


class Block extends Model {

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
  get defaults() {
    return {
      content: '',
      index: 0,
      is_centered: false,
      is_last: false,
      section_index: 0,
      source: '',
      type: TypeConstants.block.paragraph,
    };
  }

  get length() {
    return this.get('content').length;
  }

  get name() {
    return 'Block';
  }

  get relations() {
    return [
      {
        type: 'HasMany',
        key: 'elements',
        relatedModel: ModelDirectory.get('Element'),
      },
    ];
  }

  // --------------------------------------------------
  // Conditionals
  // --------------------------------------------------
  isCentered() {
    return this.get('is_centered');
  }

  isEditable() {
    return this.get('type') !== TypeConstants.block.divider;
  }

  isImage() {
    return this.get('type') === TypeConstants.block.image;
  }

  isLast() {
    return this.get('is_last');
  }

  isList() {
    return this.get('type') === TypeConstants.block.list;
  }

  isParagraph() {
    return this.get('type') === TypeConstants.block.paragraph;
  }

  isQuote() {
    return this.get('type') === TypeConstants.block.quote;
  }

  // --------------------------------------------------
  // Methods
  // --------------------------------------------------
  addFragment(fragment, offset) {
    var content = this.get('content');
    var length = fragment.length;
    this.set('content', content.substring(0, offset) +
                        fragment +
                        content.substring(offset));
    for (var element of this.get('elements').models) {
      if (element.get('start') >= offset) {
        element.incrementOffsets(length);
      } else if (element.get('end') >= offset) {
        element.set('end', element.get('end') + length);
      }
    }
  }

  cloneDestructively(offset) {
    var paragraph = TypeConstants.block.paragraph;
    var content = this.get('content');
    var block = new Block({
      content: content.substring(offset),
      type: this.get('type'),
    });
    if (!block.isList()) {
      block.set({
        is_centered: block.length ? this.isCentered() : false,
        type: block.length ? this.get('type') : paragraph,
      });
    }
    var elements = this.get('elements');
    for (var i = 0; i < elements.length; i += 1) {
      var element = elements.at(i);
      if (element.get('start') < offset && element.get('end') > offset) {
        var clones = element.partialClones(offset, offset);
        var start = clones[1].get('start');
        elements.remove(element);
        elements.add(clones[0], i);
        block.get('elements').push(clones[1].decrementOffsets(start));
      } else if (element.get('start') >= offset) {
        elements.remove(element);
        block.get('elements').push(element.decrementOffsets(offset));
        i -= 1;
      }
    }
    this.set('content', content.substring(0, offset));
    if (!this.length) {
      this.set({ type: paragraph, is_centered: false });
    }
    return block;
  }

  elementComparator(element) {
    return [
      element.get('type'),
      element.get('start'),
      element.get('end'),
    ];
  }

  filterStyles(start, end) {
    var bucket = [];
    var type = this.get('type');
    var types = TypeConstants.block;
    bucket.push([types.centered, this.isCentered()]);
    bucket.push([types.headingOne, type === types.headingOne]);
    bucket.push([types.headingTwo, type === types.headingTwo]);
    bucket.push([types.headingThree, type === types.headingThree]);
    bucket.push([types.list, this.isList()]);
    bucket.push([types.quote, this.isQuote()]);
    for (var element of this.get('elements').models) {
      if (element.get('start') <= start && element.get('end') >= end) {
        bucket.push([element.get('type'), true]);
      }
    }
    return new Map(bucket);
  }

  mergeElements() {
    var elements = this.get('elements');
    elements.comparator = this.elementComparator;
    elements.sort();
    for (var i = 0; i < elements.length - 1; i += 1) {
      var element = elements.at(i + 1);
      if (elements.at(i).mergeElement(element)) {
        elements.remove(element);
        i -= 1;
      }
    }
  }

  mergeBlock(block, offset) {
    if (!block.isImage()) {
      var content = this.get('content');
      var elements = this.get('elements');
      if (!content) {
        this.set({
          content: block.get('content'),
          is_centered: block.isCentered(),
          type: block.get('type'),
        });
      } else {
        this.set('content', content.substring(0, offset) +
                            block.get('content') +
                            content.substring(offset));
      }
      for (var element of block.get('elements').models) {
        element.incrementOffsets(offset);
        elements.push(element);
      }
    }
    return this;
  }

  parseElement(target) {
    var elements = this.get('elements');
    var bucket = [];
    var shouldIterate = false;
    for (var i = 0; i < elements.length; i += 1) {
      var element = elements.at(i);
      if (element.completelyBounds(target)) {
        var clones = element.partialClones(target.get('start'),
                                           target.get('end'));
        bucket = bucket.concat(clones);
        elements.remove(element);
        shouldIterate = true;
        i -= 1;
      }
    }
    if (shouldIterate) {
      for (var element of bucket) {
        elements.push(element);
      }
    } else {
      elements.push(target);
    }
    this.mergeElements();
  }

  removeFragment(start, end) {
    var elements = this.get('elements');
    var content = this.get('content');
    this.set('content', content.substring(0, start) +
                        content.substring(end));
    for (var i = 0; i < elements.length; i += 1) {
      var element = elements.at(i);
      var length = end - start;
      var s = element.get('start');
      var e = element.get('end');
      if (s >= start && e <= end) {
        elements.remove(element);
        i -= 1;
      } else {
        if (s >= start) {
          element.set('start', s <= end ? start : s - length);
        }
        if (e > start) {
          element.set('end', e <= end ? start : e - length);
        }
      }
    }
  }

  toCode() {
    return Formatter.codifyBlock(this);
  }

  toJSON() {
    var json = Backbone.Model.prototype.toJSON.call(this);
    json.source = '';
    return json;
  }

  toString() {
    return Formatter.stringifyBlock(this);
  }
}


module.exports = Block;
