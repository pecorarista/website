#!/bin/bash

for filename in "insertion-sort" "insertion-sort-no-end" "insertion-sort-for-to" "final" "simple-poster" "complex-poster" "arab" "rtl" "words"
do

    if [ "${filename}" = "words" ]
    then
        pandoc \
            --from=markdown \
            --to=latex \
            --template=vocabulary.tex \
            --lua-filter=filter.lua \
            --standalone \
            --output="${filename}.tex" \
            "${filename}.md"
    fi
    latexmk "${filename}.tex"
    if [ "${filename}" = "arab" ] || [ "${filename}" = "rtl" ]
    then
        pdf2svg "${filename}.pdf" "${filename}.svg"
    else
        pdfcrop "${filename}.pdf"
        pdf2svg "${filename}-crop.pdf" "${filename}.svg"
    fi
done
