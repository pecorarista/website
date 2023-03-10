const path = require('path');
const fs = require('fs');

module.exports = function(eleventyConfig) {

  eleventyConfig.addGlobalData('permalink', () => {
    return (data) => {
      let filename = path.parse(data.page.inputPath).base;
      return filename.startsWith('_') ? false : `${data.page.filePathStem}.${data.page.outputFileExtension}`;
    };
  });

  eleventyConfig.addGlobalData('includeFile', () => {
    return (filename) => {
      return fs.readFileSync(filename);
    };
  });

  return {
    templateFormats: ['njk'],
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    dir: {
      input: 'nunjucks',
      output: 'dist'
    }
  };

};
