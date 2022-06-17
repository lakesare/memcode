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
    // "react/jsx-fragments": ""

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

    "react/require-default-props": "off",

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

    // for "INSERT INTO problems (content, course_id, created_at) VALUES (${content}, ${courseId}, ${created_at}) RETURNING *",
    "quotes": "off",

    "quote-props": ["error", "consistent-as-needed"],

    "no-plusplus": "off",

    // I know myseeelf when to use or not to use it.
    "no-await-in-loop": "off",

    "no-unused-expressions": "off",
    "consistent-return": "off",



    // because it doesn't understand import `~/hi/hello`
    "import/no-unresolved": "off",
    "import/extensions": "off",
    "import/first": "off",

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

    // it was prohibiting (saveFn) =>, wanted it without ()
    "arrow-parens": "off",

    "consistent-return": "off",

    // sometines it's really not needed
    "default-case": "off",

    "import/newline-after-import": "off",

    // didn't allow me to write "he's" in react! well maybe it's a bad thing to do, may be worth checking
    "react/no-unescaped-entities": "off",

    // sometimes it's more readable without them!
    "react/jsx-wrap-multilines": "off",

    "no-return-assign": "off",

    "radix": "off",

    "array-callback-return": "off",

    // switch
    // case
    // "indent": [2, 2, { "SwitchCase": "" }]

    "react/jsx-pascal-case": "off",

    "no-confusing-arrow": "off",

    "jsx-a11y/label-has-for": "off",

    // yeah it's just faster sometimes
    "react/no-string-refs": "off",

    "no-param-reassign": "off",

    "react/no-find-dom-node": "off",

    // maybe it's useful, but I don't get it
    "no-prototype-builtins": "off",

    "no-underscore-dangle": "off",

    // to allow::: hi ? hi : 'else'
    // it reads better.
    "no-unneeded-ternary": "off",

    // to allow
    // export default {
    //   sortByAmountOfCourses, sortByAlphabet,
    //   deriveCategoriesPerGroup
    // };
    "object-property-newline": "off",

    // It wasn't allowing me
    // let lastIndexOfSelection = range.index + range.length - 1;
    "no-mixed-operators": "off",

    // airbnb makes me move around getters setter, ugh
    // copypasted the default config instead.
    "react/sort-comp": [1, {
      order: [
        'static-methods',
        'lifecycle',
        'everything-else',
        'render'
      ],
      groups: {
        lifecycle: [
          'displayName',
          'propTypes',
          'contextTypes',
          'childContextTypes',
          'mixins',
          'statics',
          'defaultProps',
          'constructor',
          'getDefaultProps',
          'state',
          'getInitialState',
          'getChildContext',
          'getDerivedStateFromProps',
          'componentWillMount',
          'UNSAFE_componentWillMount',
          'componentDidMount',
          'componentWillReceiveProps',
          'UNSAFE_componentWillReceiveProps',
          'shouldComponentUpdate',
          'componentWillUpdate',
          'UNSAFE_componentWillUpdate',
          'getSnapshotBeforeUpdate',
          'componentDidUpdate',
          'componentDidCatch',
          'componentWillUnmount'
        ]
      }
    }],

    // because it was forcing me to put this into production dependencies for some reason:
    // const WebpackNotifierPlugin = require('webpack-notifier');
    "import/no-extraneous-dependencies": ["error", {"devDependencies": true}],

    'jsx-a11y/no-noninteractive-element-interactions': "off",

    // Sometimes unneeded () => {}{}{} are expressive!
    "arrow-body-style": "off",

    "quote-props": "off",

    "no-lonely-if": "off"
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
    "FileReader": true,
    "Blob": true,
    "location": true,
    "navigator": true,
    "URLSearchParams": true, // we have a polyfill
    "URL": true,
    "Image": true,

    // in our tests
    "describe": true,
    "expect": true,
    "beforeEach": true,

    // things I make global with ProvidePlugin
    "React": true,
    "PropTypes": true,
    "connect": true,

    // only available and used via service-worker.js
    "workbox": true,
    "self": true,
    "caches": true,

    "Audio": true,

    "sessionStorage": true

    // "DefinePlugin": true
  }
}
