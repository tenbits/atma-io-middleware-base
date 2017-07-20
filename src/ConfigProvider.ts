import appcfg from 'appcfg';
import { obj_extendMany } from 'atma-utils';

export default class ConfigProvider {
	options: any
	constructor (public name: string, public defaultOptions: string) {
		this.name = name;
	}
	load () {
		let defaultOptions = this.defaultOptions;
		let packageOptions = PackageLoader.load(this.name);
		let globalOptions = GlobalLoader.load(this.name);

		return obj_extendMany({}, defaultOptions, packageOptions, globalOptions);
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

namespace Utils {
	export function readOptions (cfg, name) {
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
}