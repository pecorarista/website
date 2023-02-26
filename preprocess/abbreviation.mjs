import fs from 'fs';

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
