const SourceMapFile = require('./SourceMapFile');
const AtmaServer = require('./AtmaServer');

module.exports = class Middleware {
	constructor (middlewareDefintion, options, compiler) {
		let { extensions, mimeType } = middlewareDefintion;

		options.extensions = options.extensions || extensions;
		options.mimeType = options.mimeType || mimeType;
		
		let { name } = middlewareDefintion;
		this.globalOptions = options;
		
		this.options = Object.assign({}, options);
		this.compiler = compiler;
		this.name = name;
	}
	process (file, config) {
		this.compiler.compile(file, config);
	}
	processAsync (file, config, done) {
		this.compiler.compileAsync(file, config, done);
	}

	/** Atma-Server */

	attach (app) {
		let globalOpts = Object.assign({}, this.options);
		let appOptions = app.config && (app.config.$get(`settings.${this.name}`) || app.config.$get(`${this.name}`));
		if (appOptions) {
			globalOpts = Object.assign(globalOpts, appOptions);
		}
		let extensions = globalOpts.extensions;
		if (extensions) {
			extensions = normalizeExtensions(extensions);
		}
		AtmaServer.attach(app, extensions, this, globalOpts);
	}
	
	/** IO **/
	read (file, config) {
		this.process(file, config);
	}
	readAsync (file, config, done) {
		this.processAsync(file, config, done);	
	}
	write (file, config) {
		this.process(file, config);
	}
	writeAsync (file, config, done) {
		this.processAsync(file, config, done);	
	}

	register (io, extraOptions) {
		io.File.middleware[this.name] = this;
		let opts = this.options;
		if (extraOptions) {
			this.setOptions(extraOptions)
		}
		let {extensions, sourceMap} = opts;		
		let extensionsMap = normalizeExtensions(extensions);

		registerExtensions(io.File, extensionsMap, sourceMap);		
	}
	setOptions (opts) {
		this.options = Object.assign({}, this.globalOptions);
		if (opts) {
			this.options = Object.assign(this.options, opts); 
		}
		this.compiler.setOptions(this.options);
	}
};

/**
 * Prepair Extensions Map Object for the io.File.registerExtensions 
 * @param {Array|Object} mix
 * @return {Object} Example: { fooExt: ['current-midd-name:read'] } 
 */
function normalizeExtensions (mix) {
	let map = {};
	if (mix == null) {
		return map;
	}
	if (Array.isArray(mix)) {
		mix.forEach(ext => map[ext] = [`${name}:read`]);
		return map;
	} 
	for(let ext in mix) {
		let str = mix[ext] || 'read', 
			types;
		if (str.indexOf(',') > -1) {
			types = str.trim().split(',').map(x => x.trim());
		} else {
			types = [str.trim()];
		}
		map[ext] = [];
		types.forEach(type => map[ext].push(`${name}:${type}`));
	}
	return map;
}

function registerExtensions (File, extMap, withSourceMap = false) {
	if (File.setMiddlewares) {
		File.setMiddlewares(extMap);
	} else {
		// back compat
		File.registerExtensions(extMap);
	}
	if (withSourceMap) {
		for (let ext in map) {
			Factory.registerHandler(
				new RegExp('\\.' + ext + '.map$', 'i')
				, SourceMapFile
			); 
		}
	}
}
