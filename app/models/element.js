import Model from 'app/templates/model';

import ModelDirectory from 'app/directories/model_directory';

import TypeConstants from 'app/constants/type_constants';

class Element extends Model {

  // --------------------------------------------------
  // Getters
  // --------------------------------------------------
  get defaults() {
    return {
      end: 0,
      start: 0,
      type: TypeConstants.element.bold,
      url: '',
    };
  }

  get name() {
    return 'Element';
  }

  get relations() {
    return [];
  }

  // --------------------------------------------------
  // Conditionals
  // --------------------------------------------------
  isLink() {
    return this.get('type') === TypeConstants.element.link;
  }

  // --------------------------------------------------
  // Methods
  // --------------------------------------------------
  completelyBounds(element) {
    return this.get('type') === element.get('type') &&
           this.get('start') <= element.get('start') &&
           this.get('end') >= element.get('end');
  }

  decrementOffsets(value) {
    this.set('start', this.get('start') - value);
    this.set('end', this.get('end') - value);
    return this;
  }

  incrementOffsets(value) {
    this.set('start', this.get('start') + value);
    this.set('end', this.get('end') + value);
    return this;
  }

  mergeElement(element) {
    if (this.get('type') === element.get('type') &&
        this.get('start') <= element.get('end') &&
        this.get('end') >= element.get('start')) {
      return this.setOffsets(
        Math.min(this.get('start'), element.get('start')),
        Math.max(this.get('end'), element.get('end'))
      );
    } else {
      return false;
    }
  }

  partialClones(start, end) {
    var clones = [];
    if (start > this.get('start')) {
      clones.push(new Element({
        end: start,
        start: this.get('start'),
        type: this.get('type'),
      }));
    }
    if (end < this.get('end')) {
      clones.push(new Element({
        end: this.get('end'),
        start: end,
        type: this.get('type'),
      }));
    }
    return clones;
  }

  setOffsets(startOffset, endOffset) {
    this.set('start', startOffset);
    this.set('end', endOffset);
    return true;
  }
}

module.exports = Element;
