import * as appcfg from 'appcfg';
import { is_rawObject } from 'atma-utils';
import { IOptions } from './IConfig'



export default class ConfigProvider {
    options: IOptions
    constructor (public name: string, public defaultOptions: IOptions) {
        this.name = name;
    }
    load () {
        let defaultOptions = this.defaultOptions;
        let packageOptions = PackageLoader.load(this.name);
        let globalOptions = GlobalLoader.load(this.name);

        let options = {};
        Utils.mergeDeep(options, defaultOptions);
        Utils.mergeDeep(options, packageOptions);
        Utils.mergeDeep(options, globalOptions);
        return options;
    }
}

class PackageLoader {
    static load (name) {
        let cfg = appcfg.fetch([ { path: 'package.json', optional: true }], { sync: true });
        return Utils.readOptions(cfg, name);
    }
}

class GlobalLoader {
    static load (name) {
        let _ = global as any;
        let cfg = _.app && _.app.config || _.config;
        return Utils.readOptions(cfg, name);
    }
}

export namespace Utils {
    export function readOptions (cfg, name: string) {
        if (cfg == null) {
            return null;
        }
        if (cfg.$get) {
            return cfg.$get(`${name}`)
                || cfg.$get(`settings.${name}`)
                || cfg.$get(`atma.settings.${name}`)
                ;
        }
        return (cfg[name])
            || (cfg.settings && cfg.settings[this.name])
            || (cfg.atma && cfg.atma.settings && cfg.atma.settings[this.name])
            ;
    };

    export function mergeDeep(a: object, b: object) {
        for (var key in b) {
            let bVal = b[key];
            if (bVal == null) {
                continue;
            }
            let aVal = a[key];
            if (aVal == null) {
                a[key] = b[key];
                continue;
            }
            if (is_rawObject(aVal) && is_rawObject(bVal)) {
                mergeDeep(aVal, bVal);
                continue;
            }
            a[key] = bVal;
        }
    }
}
