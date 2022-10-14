MathJax = {
  loader: {
    load: [
      '[tex]/cases',
      '[tex]/empheq'
    ]
  },
  tex: {
    packages: {
      '[+]': [
        'empheq',
        'cases'
      ]
    },
    autoload: {
      cases: [[], ['numcases', 'subnumcases']]
    },
    macros: {
      abs: ["\\left|#1\\right|", 1],
      brackets: ["\\left[#1\\right]", 1],
      diag: "\\mathop{\\rm diag}",
      ff: "\\mathop{\\rm FF}",
      id: "\\mathop{\\rm id}",
      imaginary: "\\mathop{\\rm Im}",
      minimize: "\\mathop{\\rm minimize}",
      nn: "\\mathop{\\rm NN}",
      norm: ["\\left\\|#1\\right\\|", 1],
      parentheses: ["\\left(#1\\right)", 1],
      real: "\\mathop{\\rm Re}",
      res: "\\mathop{\\rm Res}",
      relu: "\\mathop{\\rm ReLU}",
      softmax: "\\mathop{\\rm softmax}",
      trace: "\\mathop{\\rm tr}"
    },
    tags: 'ams',
  }
};
