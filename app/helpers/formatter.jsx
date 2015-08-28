import React from 'react';

import TypeConstants from 'app/constants/type_constants';


class Formatter {

  codifyBlock(block) {
    var elements = block.get('elements');
    var characters = block.get('content').split('');
    var sets = this.parseElements(elements, false);
    return this.mergeCode(characters, sets[0], sets[1]);
  }

  parseElements(elements, needsClass=true) {
    var openers = {};
    var closers = {};
    elements.map(function(element) {
      var start = element.get('start');
      var end = element.get('end');
      var type = element.get('type');
      var opener = '';
      var closer = '';
      if (type === TypeConstants.element.bold) {
        opener = '<strong>';
        closer = '</strong>';
      } else if (type === TypeConstants.element.italic) {
        opener = '<i>';
        closer = '</i>';
      } else {
        var url = element.get('url') + '\'>';
        if (needsClass) {
          opener = '<span class=\'element-link\' data-url=\'' + url;
          closer = '</span>';
        } else {
          opener = '<a href=\'' + url;
          closer = '</a>';
        }
      }
      openers[start] = openers[start] ? openers[start] + opener : opener;
      closers[end] = closers[end] ? closer + closers[end] : closer;
    });
    return [openers, closers];
  }

  mergeCode(characters, openers, closers) {
    var index = 0;
    var nodes = [];
    var string = '';
    var helper = function(style, content) {
      if (string) {
        nodes.push(<span className={'code'} key={index}>{string}</span>);
        index += 1;
        string = '';
      }
      nodes.push(<span className={style} key={index}>{content}</span>);
      index += 1;
    };
    for (var i = 0; i < characters.length; i += 1) {
      if (closers[i]) {
        helper('code code-red', closers[i]);
      }
      if (openers[i]) {
        helper('code code-red', openers[i]);
      }
      string += characters[i];
    }
    if (string) {
      nodes.push(<span className={'code'} key={index}>{string}</span>);
    }
    return nodes;
  }

  mergeStrings(characters, openers, closers) {
    var content = '';
    for (var i = 0; i < characters.length; i += 1) {
      if (closers[i]) {
        content += closers[i];
      }
      if (openers[i]) {
        content += openers[i];
      }
      content += characters[i];
    }
    return content;
  }

  stringifyBlock(block) {
    var elements = block.get('elements');
    var characters = block.get('content').split('');
    var tags = this.parseElements(elements);
    return this.mergeStrings(characters, tags[0], tags[1]);
  }
}


module.exports = new Formatter();
