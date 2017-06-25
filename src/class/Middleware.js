const SourceMapFile = require('./SourceMapFile');

module.exports = class Middleware {
	constructor (middlewareDefintion, options, compiler) {
		let { name, extensions } = middlewareDefintion;

		this.options = options;
		this.compiler = compiler;
		this.name = name;
		this.extensions = extensions;
	}
	process (file, config) {
		this.compiler.compile(file, config);
	}
	processAsync (file, config, done) {
		this.compiler.compileAsync(file, config, done);
	}

	register (io) {
		if (io == null) {
			return;
		}
		let { File } = io;
		let { name, extensions } = this;		
		File.middleware[name] = this;
		if (extensions) {
			let map = { };
			let mix = extensions;
			if (Array.isArray(mix)) {
				extensions.forEach(ext => map[ext] = [`${name}:read`]);				
			} else {
				for(let ext in mix) {
					let str = mix[ext] || 'read', 
						types;
					if (str.indexOf(',') > -1) {
						types = str.trim().split(',').map(x => x.trim());
					} else {
						types = [str.trim()];
					}
					let definitions = map[ext] = [];
					types.forEach(type => definitions.push(`${name}:${type}`));
				}
			}
			File.registerExtensions(map);
			if (this.options.sourceMap) {
				for (let ext in map) {
					Factory.registerHandler(
						new RegExp('\\.' + ext + '.map$', 'i')
						, SourceMapFile
					);
				}
			}
		}
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

	
};
