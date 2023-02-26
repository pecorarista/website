import fs from 'fs';

let content = JSON.parse(fs.readFileSync('data/inner-universe.json', 'utf-8'));
let htmls = content.sections.map(section => {
  return '<ul>' + section.vocabulary.map(entry => {
    const w = entry.word;
    let elements = [
     `<span class="russian">${w.surface}</span>`
    ];

    if (w.pronunciation) {
      elements.push(`<span class="ipa">/${w.pronunciation}/</span>`);
    }

    let grammar = [];

    switch (w.grammar.pos) {
      case 'noun':
        elements.push(`<span class="grammar">${w.grammar.gender + " " + w.grammar.animacy}</span>`);
        grammar.push(w.grammar.number),
        grammar.push(w.grammar.case);
        break;
      case 'verb':
        elements.push(`<span class="grammar">${w.grammar.aspect}</span>`);
        if (w.grammar.isinf) {
          grammar.push('inf');
        } else {
          grammar.push(w.grammar.gender);
          if ((w.grammar.person || "") + w.grammar.number != "") {
            grammar.push(w.grammar.person + w.grammar.number);
          }
          if (w.grammar.tense) {
            grammar.push(w.grammar.tense);
          }
        }
        break;
      case 'adj':
      case 'adv':
      case 'pron':
        if (w.translation) {
          // e.g., я /ja/ (pron) (私) (1sg nom)
          elements.push(`<span class="grammar">${w.grammar.pos}</span>`);
        } else {
          // e.g., я /ja/ () () (pron 1sg nom)
          grammar.push(w.grammar.pos);
        }

        if ((w.grammar.person || "") + w.grammar.number != "") {
          grammar.push(w.grammar.person + w.grammar.number);
        }
        if (w.grammar.gender) {
          grammar.push(w.grammar.gender);
        }
        if (w.grammar.case) {
          grammar.push(w.grammar.case);
        }
        if (w.grammar.degree) {
          grammar.push(w.grammar.degree);
        }
        break;
      default:
        elements.push(`<span class="grammar">${w.grammar.pos}</span>`);
        break;
    }

    if (w.args) {
      elements.push('[+ ' + w.args.join(', ') + ']');
    }

    if (w.translation) {
      elements.push(`<span class="translation">${w.translation}</span>`);
    }
    elements.push(`<span class="grammar">${grammar.join(' ')}</span>`);

    if (entry.lemma) {
      let lemma = entry.lemma;
      elements.push(`←`);
      elements.push(`<span class="russian">${lemma.surface}</span>`);
      elements.push(`<span class="ipa">/${lemma.pronunciation}/</span>`);
    }

    if (entry.note) {
      elements.push(`${entry.note}`);
    }

    return '<li>' + elements.join(`<span class="widespace"> </span>`) + '</li>';

  }).join('') + '</ul>\n';
});

htmls.forEach((html, index) => {
  fs.writeFileSync(`./nunjucks/posts/_include/_inner-universe-vocabulary-${index + 1}.njk`, html);
});
