const path = require('path');

module.exports = function(eleventyConfig) {

  eleventyConfig.addGlobalData('permalink', () => {
    return (data) => {
      let filename = path.parse(data.page.inputPath).base;
      return filename.startsWith('_') ? false : `${data.page.filePathStem}.${data.page.outputFileExtension}`;
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
