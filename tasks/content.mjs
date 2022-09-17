import fs from 'fs';

export const writeContents = (done) => {
  const abbrev = JSON.parse(fs.readFileSync('data/abbreviations.json', 'utf-8')).categories.map(category =>
    `<li>〈${category.translation}〉`
      + `<ul class="list-inline">`
      + category.subcategories.map(subcategory =>
        `<li class="list-inline-item">` + [
          `<span class="grammar">${subcategory.abbrev}</span>`,
          `<em class="serif">${subcategory.term}</em>`,
          `<span class="translation">${subcategory.translation}</span>`,
        ].join(`<span class="widespace"> </span>`)
        + `</li>`
      ).join('')
      + `</ul>`
      + `</li>`
  ).join('');
  fs.writeFileSync(
    `nunjucks/posts/_include/_abbreviations.njk`,
    `<ul style="list-style-type: none; padding-left: 1.08rem;">` + abbrev + `</ul>`
  );

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

  let rows = [];
  let symbols = [];
  JSON.parse(fs.readFileSync('data/phonetic-alphabets.json', 'utf-8')).alphabets.forEach(alphabet => {
    symbols.push(alphabet.symbol);
    rows.push(
      `<tr>
        <td class="ipa">
          ${alphabet.symbol}
        </td>
        <td>
          ${alphabet.name}
        </td>
        <td>
          ${alphabet.vim.length > 0 ? '<kbd>' + alphabet.vim.join("</kbd> <kbd>") + '</kbd>' : ''}
        </td>
        <td class="monospace">
          ${alphabet.tipa}
        </td>
        <td>
            ${alphabet.compose.length > 0 ? '<kbd>' + alphabet.compose.join("</kbd> <kbd>") + '</kbd>' : ''}
        </td>
        <td>
          ${alphabet.xsampa.length > 0 ? '<kbd>' + alphabet.xsampa.join("</kbd> <kbd>") + '</kbd>' : ''}
        </td>
      </tr>`
    );
  });

  const table = `
    <table class="table table-bordered table-striped">
      <thead>
        <tr>
          <th>Symbol</th><th>Name</th><th>Vim</th><th>TIPA</th><th>Compose</th><th>X-SAMPA</th>
        </tr>
      </thead>
    `
    + rows.join('')
    + '</table>'
  const font = `<link href="https://fonts.googleapis.com/css?family=Judson&amp;subset=latin-ext,vietnamese&text=${encodeURIComponent('abcdefghijklmnopqrstuvwxyz' + symbols.join(''))}" rel="stylesheet">`
  fs.writeFileSync(`nunjucks/posts/_include/_ipa-table.njk`, table);
  fs.writeFileSync(`nunjucks/_layout/_ipa-font.njk`, font);

  done();
};
