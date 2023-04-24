function transform(element) {

  const ELEMENT_NODE = 1;

  const hiragana = '\u3040-\u309F～';
  const katakana = '\u30A0-\u30FF';
  const kanji = '\u2E80-\u2FFF\u31C0-\u31EF\u3300-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uFE30-\uFE4F';

  const punct = '[—@&=_\,\.\?\!\$\%\^\*\-\+\/]';
  const left = `[\\[({'"<«‘“]`;
  const right = `[\\])}'">»’”]`;

  const cjk = '[' +  [hiragana, katakana, kanji].join('') + ']';
  const latin = '[A-Za-z0-9\u00C0-\u00FF\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF]' + '|' + punct;

  const patterns = {
    quarter: [
      '(' + cjk + ')(' + latin + '|' + left + ')',
      '(' + latin + '|' + right + ')(' + cjk + ')',
      '(・)(' + cjk + ')',
      '(' + latin + '|' + cjk + ')([・])',
      '([：])([『])',
      '(' + cjk + ')([：])'
    ],
    // if proportional
    half: [
      '([、。，．）」』])(' + left + '|' + latin + '|' + cjk + ')',
      '(' + latin + '|' + cjk + ')([（「『])'
    ]
  };

  Object.keys(patterns).forEach(space => {
    patterns[space].forEach(pattern => {
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
      if (p.firstChild.nodeType == ELEMENT_NODE) {
        let newElement = document.createElement('span');
        newElement.className = space;
        p.parentNode.insertBefore(newElement, p);
        p.querySelector(`span.${space}:first-child`).remove();
      }
    });

    element.normalize();

  });
}

document.addEventListener('DOMContentLoaded', event => {

  document.querySelectorAll('a[href^="http"]').forEach(element => {
    element.setAttribute('target', '_blank');
  });

  document.body.querySelectorAll('p, li, h1, h2, h3, h4, h5').forEach(element => {
    transform(element);
  });

});
