const appcfg = require('appcfg');


class ConfigProvider {
	constructor (name, defaultOptions) {
		this.name = name;
		this.options = defaultOptions;		
	}
	load () {
		let defaultOptions = this.options;
		let packageOptions = PackageLoader.load(this.name);
		let globalOptions = GlobalLoader.load(this.name);

		return Utils.extendOptions(defaultOptions, packageOptions, globalOptions);
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
		let cfg = global.app && global.app.config || global.config;
		return Utils.readOptions(cfg, name);
	}
}

class Utils {
	static readOptions (cfg, name) {
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
	}
	static extendOptions (a, b) {
		if (b == null) {
			return a;
		}
		return Object.assign(a || {}, b);
	}
}

module.exports = ConfigProvider;