module.exports = {
  "parser": "babel-eslint",
  "extends": "airbnb",
  "rules": {
    "linebreak-style": "off",
    "new-cap": "off",
    "import/no-named-as-default": "off",
    "jsx-a11y/href-no-hash": "off",
    "no-console": "off",
    "comma-dangle": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "react/forbid-prop-types": "off",
    "react/jsx-no-bind": "off",
    
    // because it doesn't understand import `~/hi/hello`
    "import/no-unresolved": "off",
    "import/extensions": "off",
    "import/first": "off",
    "import/newline-after-import": "off",

    // for cases such as this:
    // openModal  = () => this.setState({ ifModalIsOpen: true })
    // closeModal = () => this.setState({ ifModalIsOpen: false })
    "no-multi-spaces": "off",

    // for {
    //   a:         1,
    //   bbbbbbbbb: 2
    // }
    "key-spacing": ["error", { "mode": "minimum" }],

    // lakesare: didn't allow me to do:
    // if ($('main.admin.users')   .length) { Profiles(); }
    // if ($('main.profiles.index').length) { Profiles(); }
    "no-whitespace-before-property": "off",

    // lakesare: because I don't see why comments can't be long, doesn't everyone have wrapping in their text editors?
    "max-len": "off",

    // lakesare: because I feel like 
    // if { return } else { return }
    // is more clear than
    // if { return }; return
    "no-else-return": "off",

    // we probably know better when to use what (`` vs "")
    "prefer-template": "off",

    // If you are certain the content passed to dangerouslySetInnerHTML is sanitized HTML you can disable this rule.
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-danger.md
    "react/no-danger": "off",

    // because I like export { hi }
    "import/prefer-default-export": "off",

    "no-use-before-define": "off",
    "react/jsx-space-before-closing": "off",
    "react/jsx-tag-spacing": "off",
    "react/jsx-filename-extension": "off",

    // RootPage = connect(() => ({}), mapDispatchToProps)(RootPage);
    "no-class-assign": "off",

    // to allow Page_courses_new naming
    "camelcase": "off",

    // while we're developing it's faster to write all components as classes
    "react/prefer-stateless-function": "off",

    // accessibility is important, but turn it off while developing
    "jsx-a11y/img-has-alt": "off",

    "no-multi-str": "off",

    // didn't allow request.body['course'], wanted body.course
    "dot-notation": "off",

    // it was prohibiting (saveFn) =>, wanted it without ()
    "arrow-parens": "off",

    // didn't allow pg-promise's
    // db.one('select * from courses where id = ${courseId}'
    "no-template-curly-in-string": "off",

    // for "INSERT INTO problems (content, explanation, course_id, created_at) VALUES (${content}, ${explanation}, ${courseId}, ${created_at}) RETURNING *",
    "quotes": "off"
  },
  "globals": {
    "fetch": true,
    "it": true,
    "expect": true,
    "alert": true,
    "document": true,
    "localStorage": true,
    "confirm": true,
    "FormData": true,
    "window": true,
    "Headers": true,

    // in our tests
    "describe": true,
    "expect": true,
  }
}
