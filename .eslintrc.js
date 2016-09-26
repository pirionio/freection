module.exports = {
    "parser": "babel-eslint",
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": ["eslint:recommended", "plugin:react/recommended", "plugin:import/errors", "plugin:import/warnings"],
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "import"
    ],
    "settings": {
        "import/ignore": [/\.(png)$/, 'node_modules']
    },
    "globals": {
        "chrome": true
    },
    "rules": {
        "strict": 0,
        "indent": [
            "error",
            4, {SwitchCase: 1}
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ],
        "no-case-declarations": [0],
        "no-var": ["error"],
        "arrow-parens": ["error", "as-needed"],
        "arrow-spacing": ["error"],
        "prefer-arrow-callback": ["warn"],
        "dot-location": ["error", "property"],
        "prefer-const": ["error"],
        "prefer-rest-params": ["error"],
        "prefer-template": ["error"],
        "eqeqeq": ["error", "smart"],
        "no-else-return": ["error"],
        "no-confusing-arrow": ["error"],
        "react/prop-types":["error", {
            ignore: ["dispatch", "children", "sheet", "params"]
        }],
        "react/no-find-dom-node": ["warn"],
        "react/no-danger": ["warn"],
        "import/no-commonjs": ["error"],
        "import/imports-first": ["error"],
        "import/newline-after-import": ["error"],
        "import/order": ["error", {
            "groups": ["builtin", "external", ["internal", "parent", "sibling", "index"]],
            "newlines-between": "always"
        }]
    }
};