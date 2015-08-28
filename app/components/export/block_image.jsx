import React from 'react';

import Component from 'app/templates/component';


class BlockImage extends Component {

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  renderCaption() {
    return [
      <p className={'code'}>
        <span className={'code code-red'}>
          {'        <p'}
        </span>
        <span className={'code code-green'}>
          {' class='}
        </span>
        <span className={'code code-blue'}>
          {'\'block block-caption\''}
        </span>
        <span className={'code code-red'}>
          {'>'}
        </span>
      </p>,
      <p className={'code indented-secondary'}>
        {'          ' + this.props.block.get('content')}
      </p>,
      <p className={'code code-red'}>
        {'        </p>'}
      </p>,
    ];
  }

  renderImage() {
    var indent = this.props.block.length ? '        ' : '      ';
    return (
      <p className={'code'}>
        <span className={'code code-red'}>
          {indent + '<image'}
        </span>
        <span className={'code code-green'}>
          {' class='}
        </span>
        <span className={'code code-blue'}>
          {'\'block block-image\''}
        </span>
        <span className={'code code-green'}>
          {' src='}
        </span>
        <span className={'code code-purple'}>
          {'\'IMAGE SOURCE HERE\''}
        </span>
        <span className={'code code-red'}>
          {'>'}
        </span>
      </p>
    );
  }

  render() {
    if (this.props.block.length) {
      return (
        <code>
          <p className={'code'}>
            <span className={'code code-red'}>
              {'      <div'}
            </span>
            <span className={'code code-green'}>
              {' class='}
            </span>
            <span className={'code code-blue'}>
              {'\'section\''}
            </span>
            <span className={'code code-red'}>
              {'>'}
            </span>
          </p>
          {this.renderImage()}
          {this.renderCaption()}
          <p className={'code code-red'}>
            {'      </div>'}
          </p>
        </code>
      );
    } else {
      return (
        <code>
          {this.renderImage()}
        </code>
      );
    }
  }
}


module.exports = BlockImage;
