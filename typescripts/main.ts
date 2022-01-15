import * as findAndReplaceDOMText  from 'findandreplacedomtext';

enum Space {
  Quarter = 'quarter',
  Half = 'half'
}

class TextAutospace {

  static readonly ELEMENT_NODE = 1;

  quarterPatterns: Array<string>;
  halfPatterns: Array<string>;

  constructor() {
    const hiragana = '\u3040-\u309F～';
    const katakana = '\u30A0-\u30FF';
    const kanji = '\u2E80-\u2FFF\u31C0-\u31EF\u3300-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uFE30-\uFE4F';

    const punct: string = '[—@&=_\,\.\?\!\$\%\^\*\-\+\/]';
    const left: string = `[\\[({'"<«‘“]`;
    const right: string = `[\\])}'">»’”]`;

    const cjk = '[' +  [hiragana, katakana, kanji].join('') + ']';
    const latin = '[A-Za-z0-9\u00C0-\u00FF\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF]' + '|' + punct;

    this.quarterPatterns = [
      '(' + cjk + ')(' + latin + '|' + left + ')',
      '(' + latin + '|' + right + ')(' + cjk + ')',
      '(・)(' + cjk + ')',
      '(' + latin + '|' + cjk + ')([・])',
      '([：])([『])',
      '(' + cjk + ')([：])'
    ];
    this.halfPatterns = [
      '([、。，．）」』])(' + left + '|' + latin + '|' + cjk + ')',
      '(' + latin + '|' + cjk + ')([（「『])'
    ];

  }
  transform(element: Node): void {
    [Space.Quarter, Space.Half].forEach(space => {
      let patterns = (space == Space.Quarter) ?  this.quarterPatterns : this.halfPatterns;
      patterns.forEach(pattern=> {
        findAndReplaceDOMText(element, {
          find: new RegExp(pattern, 'ig'),
          replace: '$1<' + `${space}` + '>$2'
        })
      });

      findAndReplaceDOMText(element, {
        find: `<${space}>`,
        replace: () => {
          let newElement = document.createElement('span');
          newElement.className = space;
          return newElement;
        }
      });

      // Required to keep space before <code></code>
      document.querySelectorAll(`* > span.${space}:first-child`).forEach(child => {
        let p = child.parentNode;
        if (p.firstChild.nodeType == TextAutospace.ELEMENT_NODE) {
          let newElement = document.createElement('span');
          newElement.className = space;
          p.parentNode.insertBefore(newElement, p);
          p.querySelector(`span.${space}:first-child`).remove();
        }
      });

      element.normalize();

    });
  }
}

document.addEventListener('DOMContentLoaded', event => {
  document.querySelectorAll('a[href^="http"]').forEach(element => {
    element.setAttribute('target', '_blank');
  });
  let lastSection: HTMLElement = document.querySelector('section:last-child');
  if (lastSection) {
    lastSection.style.paddingBottom = '20px';
  }
  document.body.querySelectorAll('p, li, h1, h2, h3, h4, h5').forEach(element => {
    let t = new TextAutospace();
    t.transform(element);
  });

});
