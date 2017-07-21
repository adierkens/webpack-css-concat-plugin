import path from 'path';
import fs from 'fs';
import findPackage from 'find-package';
import {ConcatSource, RawSource} from 'webpack-sources';
import _ from 'lodash';

const DEFAULT_CONFIG = {
  filename: undefined,
  modules: []
};

function getCssFromModule(moduleName) {
  const module = findPackage(require.resolve(moduleName), true);

  if (module && module.style) {
    // The style keyword points to a css file for this package
    const pathToCSS = path.join(path.dirname(module.paths.absolute), module.style);
    try {
      return fs.readFileSync(pathToCSS, 'utf-8');
    } catch (err) {
      console.warn(err);
    }
  }
}

export default class WebpackCssConcatPlugin {

  constructor(config) {
    this.config = _.defaults(config, DEFAULT_CONFIG);

    this.sources = _.reduce(this.config.modules, (sources, module) => {
      const src = getCssFromModule(module);
      if (src) {
        sources.push(new RawSource(src));
      }
      return sources;
    }, []);
  }

  apply(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      const cssAssets = _.values(_.pickBy(compilation.assets, (value, fName) => {
        const isCss = path.extname(fName) === '.css';
        if (isCss && !this.config.filename) {
          this.config.filename = `${path.basename(fName, '.css')}.combined.css`;
        }
        return isCss;
      }));

      if (!this.config.filename) {
        this.config.filename = 'combined.css';
      }

      if (this.config.modules.length === 0 && cssAssets < 2) {
        console.warn('Only 1 .css file found, and it\'s already being emitted. No need to run anything.');
        return callback();
      }

      if ((cssAssets.length + this.config.modules.length) === 0) {
        console.warn('No CSS found :(');
        return callback();
      }

      const css = new ConcatSource();

      _.each(_.flatten(cssAssets, this.sources), module => {
        css.add(module);
      });

      compilation.assets[this.config.filename] = css;

      return callback();
    });
  }

}
