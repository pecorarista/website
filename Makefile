.PHONY: release clean

DIST := dist
IMAGES := $(addprefix $(DIST)/static/images/, $(notdir $(wildcard images/*)))
VECTOR_IMAGES := $(addprefix $(DIST)/static/images/, $(notdir $(wildcard latex/*.svg)))
SYNTAX_HIGHLIGHT_SCRIPTS = \
	prism-bash.min.js \
	prism-latex.min.js \
	prism-makefile.min.js \
	prism-java.min.js \
	prism-javascript.min.js \
	prism-scala.min.js \
	prism-markdown.min.js \
	prism-apacheconf.min.js \
	prism-perl.min.js \
	prism-haskell.min.js \
	prism-lua.min.js
VENDOR_SCRIPTS := $(addprefix node_modules/prismjs/components/, $(SYNTAX_HIGHLIGHT_SCRIPTS)) \
    node_modules/prismjs/prism.js \
    node_modules/prismjs/plugins/line-numbers/prism-line-numbers.min.js

release: $(DIST)/CNAME \
	$(DIST)/favicon.ico \
	$(IMAGES) \
	$(VECTOR_IMAGES)

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

MATHJAX := javascripts/mathjax.js

clean:
	@rm -rf $(DIST)
