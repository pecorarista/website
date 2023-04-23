.PHONY: release clean

DIST := dist
IMAGES := $(addprefix $(DIST)/static/images/, $(notdir $(wildcard images/*)))
VIDEOS := $(addprefix $(DIST)/static/videos/, $(notdir $(wildcard videos/*)))
VECTOR_IMAGES := $(addprefix $(DIST)/static/images/, $(notdir $(wildcard latex/*.svg)))
FONTS := $(addprefix $(DIST)/static/fonts/, $(notdir $(wildcard fonts/*)))
POST_SOURCES := $(wildcard nunjucks/posts/*.njk)
POST_TARGETS := $(addprefix $(DIST)/posts/, $(notdir $(POST_SOURCES:.njk=.html)))
MAIN_PAGE_SOURCES := $(wildcard nunjucks/*.njk)
MAIN_PAGE_TARGETS := $(addprefix $(DIST)/, $(notdir $(MAIN_PAGE_SOURCES:.njk=.html)))
VOCAB := $(addsuffix .njk, $(addprefix nunjucks/posts/_include/_inner-universe-vocabulary-, $(shell seq 1 8)))

release: $(DIST)/CNAME \
	$(DIST)/favicon.ico \
	$(IMAGES) \
	$(VIDEOS) \
	$(VECTOR_IMAGES) \
	$(FONTS) \
	$(DIST)/static/css/main.css \
	$(DIST)/static/js/mathjax.js \
	$(DIST)/static/js/main.js \
	$(DIST)/static/js/findAndReplaceDOMText.js \
	$(MAIN_PAGE_TARGETS) \
	$(POST_PAGE_TARGETS)

$(DIST)/CNAME: CNAME
	@mkdir -p $(@D)
	@cp $< $@

$(DIST)/favicon.ico: favicon/favicon.ico
	@mkdir -p $(@D)
	@cp $< $@

$(DIST)/static/images/%: images/%
	@mkdir -p $(@D)
	@cp $< $@

$(DIST)/static/images/%.svg: latex/%.svg
	@mkdir -p $(@D)
	@cp $< $@

$(DIST)/static/videos/%: videos/%
	@mkdir -p $(@D)
	@cp $< $@

$(DIST)/static/fonts/%: fonts/%
	@mkdir -p $(@D)
	@cp $< $@

$(DIST)/static/js/%: javascripts/%
	@mkdir -p $(@D)
	@cp $< $@

$(DIST)/static/js/findAndReplaceDOMText.js: node_modules/findandreplacedomtext/src/findAndReplaceDOMText.js
	@mkdir -p $(@D)
	@cp $< $@

$(DIST)/static/css/main.css: scss/main.scss
	@mkdir -p $(@D)
	@npx stylelint $<
	@npx sass $< $@

nunjucks/posts/_include/_ipa-table.njk: data/phonetic-alphabets.json
	@npx node preprocess/ipa-table.mjs

nunjucks/posts/_include/_abbreviations.njk: data/abbreviations.json
	@npx node preprocess/abbreviation.mjs

$(VOCAB): data/inner-universe.json
	@npx node preprocess/abbreviation.mjs

nunjucks/posts/inner-universe.njk: $(VOCAB)

$(MAIN_PAGE_TARGETS) $(POST_TARGETS): $(MAIN_PAGE_SOURCES) $(POST_SOURCES)
	@npx @11ty/eleventy > /dev/null

clean:
	@rm -rf $(DIST)
