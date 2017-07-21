# webpack-css-concat-plugin [![Build Status](https://travis-ci.org/adierkens/webpack-css-concat-plugin.svg?branch=master)](https://travis-ci.org/adierkens/webpack-css-concat-plugin) [![npm version](https://badge.fury.io/js/webpack-css-concat-plugin.svg)](https://badge.fury.io/js/webpack-css-concat-plugin)
A webpack plugin to concat all css files in your bundle (and any dependent ones)

Combines the CSS emitted from your bundle with ones in `node_modules`. For all modules included in the config, the plugin will look for the `style` property in that module's `package.json`, and append them with your bundle's CSS.

## Usage

```javascript
# webpack.config.js
const CssConcatPlugin = require('webpack-css-concat-plugin');

module.exports = {
    // The rest of your webpack config

    plugins: [
        new CssConcatPlugin({

            // The filename for the emitted CSS file
            filename: String?,

            // Any additional modules to include in the CSS file.
            modules: [ String ] ?
        })
    ]
}
```

## TODO

- [ ] Dynamically determine the styles/modules to include based on the dependency tree.
