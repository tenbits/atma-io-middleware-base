
				// source ./templates/RootModule.js
				(function(){
					
					
				// source ./templates/ModuleSimplified.js
				var _src_ConfigProvider;
				(function () {
					var exports = {};
					var module = { exports: exports };
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

module.exports = ConfigProvider;;
				
					_src_ConfigProvider = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_package_private;
				(function () {
					var exports = {};
					var module = { exports: exports };
					module.exports = {
	io: global.io && global.io.File ? global.io : require('atma-io'),
	utils: require('atma-utils'),
	toRegexp (misc) {
		if (misc[0] === '/') {
			var str = misc.substring(1);
			var end = str.lastIndexOf('/');
			var flags = str.substring(end + 1);
			str = str.substring(0, end);
			return new RegExp(str, flags);
		}
		var rgx = `\\.${misc}($|\\?|#)`;
		return new RegExp(rgx);
	}
};;
				
					_src_package_private = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_class_Logger;
				(function () {
					var exports = {};
					var module = { exports: exports };
					const { io: { File }, utils: { class_create }} = _src_package_private;

module.exports = {
    create (logOptions) {
        let type = logOptions == null ? null : logOptions.type;
        switch (type) {
            case 'silent': 
                return new NoLogger();
            case 'file':
                return new FileLogger(logOptions);
            case 'custom':
                return new CustomLogger(logOptions);
            case 'std':
            default:
                return new ILogger();
        }
    }
}
const ILogger = class_create({
    constructor (logOptions) {
        this.options = logOptions;
    },
    lock () {},
    release () {},
    wrap (onComplete) {
       return onComplete;
    },
    write () {}
});

const DefaultLogger = class_create(ILogger, {
    lock () {
        Interceptor.hook(this);
    },
    release () {
        Interceptor.unhook();
    },
    wrap (onComplete) {
        if (onComplete == null) {
            return onComplete;
        }
        
        return (error, ...args) => {
            if (error != null) {
                this.write('stderr', error.message);
            }
            this.release();
            onComplete.apply(null, [error, ...args]);
        };
    },
    write () {

    }
});

const NoLogger = class_create(DefaultLogger, {
    
});

const FileLogger = class_create(DefaultLogger, {
    constructor () {
        this.buffer = [];
    },
    release () {
        File.write(this.options.file, this.buffer.join('\n'));
    },
    write (type, str) {
        this.buffer.push(str);
    }
});

const CustomLogger = class_create(DefaultLogger, {
    constructor (opts) {
        this.write = opts.write;
        if (typeof this.write !== 'function') {
            throw Error('Custom logger should export the `write` method');
        }
    }
})


let Interceptor;
(function () {
    let _process = global.process;
    let _stdOutWrite = _process.stdout.write;
    let _stdErrWrite = _process.stderr.write;
    let _currentListener = null;

    Interceptor = {
        hook (listener) {
            _currentListener = listener;
            setMethods(onStdOut, onStdErr);
        },
        unhook () {
            setMethods(null, null);
        }
    };

    function setMethods (stdOutFn, stdErrFn) {
        _process.stdout.write = stdOutFn || _stdOutWrite;
        _process.stderr.write = stdErrFn || _stdErrWrite;
    }
    function onStdOut (str) {
        if (_currentListener == null) {
            return;
        }
        _currentListener.write('stdout', str);
    };
    function onStdErr () {
        if (_currentListener == null) {
            return;
        }
        _currentListener.write('stderr', str);
    }
}());;
				
					_src_class_Logger = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_Compiler;
				(function () {
					var exports = {};
					var module = { exports: exports };
					const { create: createLogger } = _src_class_Logger;
module.exports = class Compiler {
	constructor (middlewareDefinition, options) {
		const { process, processAsync, textOnly = true } = middlewareDefinition;
		this.middlewareDefinition = middlewareDefinition;
		this.process_ = process;
		this.processAsync_ = processAsync;
		
		this.textOnly = textOnly;
		this.curentConfig = null;		
		this.setOptions(options);
	}
	setOptions (opts) {
		this.logger = createLogger(this.options.logger || this.middlewareDefinition.logger);
		this.options = opts;
		this.currentConfig = null;		
	}
	getOption (name) {
		let val = this.currentConfig && this.currentConfig[name];
		if (val != null) {
			return val;
		}
		return this.options[name];
	}
	process_ (content, file, compiler) {
		throw Error('Not implemented');
		return { content: null, sourceMap: null };
	}
	processAsync_ (content, file, compiler, done) {
		try {
			this.compile(file, options);
		} catch (error) {
			done(error);
			return;
		}
		done(null, file);
	}
	compile (file, config) {
		let result = this.run_('process_', file, config);
		this.applyResult_(file, result);
	}
	compileAsync (file, config, done) {
		this.run_('processAsync_', file, config, (error, result) => {
			if (error) {
				done(error);
				return;
			}
			this.applyResult_(file, result);
			done(null, result);
		});
	}

	run_ (method, file, config, done) {
		this.currentConfig = config;
		this.logger.lock();
		let isAsync = done != null;
		if (isAsync) {
			done = this.logger.wrap(done);
		}
		let result = this[method](
			this.getContent_(file), 
			file, 
			this, 			 
			done
		);
		if (isAsync === false) {
			this.logger.release();
		}
		return result;
	}
	applyResult_ (file, result) {
		file.sourceMap = result.sourceMap;
		file.content = result.content;
	}

	getContent_ (file) {
		var content = file.content;
		if (typeof content === 'string') {
			return content;
		}
		if (this.textOnly !== true) {
			return content;
		}
		if (content.toString === Object.prototype.toString) {
			return null;
		}
		return content.toString();
	}
};
				
					_src_Compiler = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_class_SourceMapFile;
				(function () {
					var exports = {};
					var module = { exports: exports };
					let { io: { File } } = _src_package_private;
let { class_Dfr: Deferred } = require('atma-utils');

module.exports = class SourceMapFile extends File {
	constructor () {
		super(...arguments)
	}
	read (opts) {
		if (this.exists('mapOnly')) 
			return super.read(opts)
		
		var path = this.getSourcePath();
		if (path == null) 
			return null;
		
		var file = new File(path);
		file.read(opts);
		return (this.content = file.sourceMap);
	}
	
	readAsync (opts){
		if (this.exists('mapOnly')) 
			return super.readAsync(opts)
		
		var path = this.getSourcePath();
		if (path == null) 
			return new Deferred.reject({code: 404});
		
		var file = new File(path);
		return file
			.readAsync(opts)
			.then(() => {
				return (this.content = file.sourceMap);
			});
	}
	exists (check) {
		if (super.exists()) 
			return true;
		if (check === 'mapOnly') 
			return false;
		
		var path = this.getSourcePath();
		return path != null
			? File.exists(path)
			: false;
	}

	getSourcePath () {
		var path = this.uri.toString(),
			source = path.replace(/\.map$/i, '');
		return path === source
			? null
			: source;
	}
};;
				
					_src_class_SourceMapFile = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_class_VirtualFile;
				(function () {
					var exports = {};
					var module = { exports: exports };
					const { 
    io: { File }, 
    utils: { class_create, class_Dfr: Deferred }, 
    toRegexp 
} = _src_package_private;

module.exports = {
    register (io, extMap, middlewareDefinition) {
        let Ctor = class_create(VirtualFile, middlewareDefinition.VirtualFile);
        Object.keys(extMap).forEach(ext => {
            io.File.getFactory().registerHandler(toRegexp(ext), Ctor);
        });
    }
};

const VirtualFile = class_create(File, {

    exists () {
        return true;
    },
    existsAsync () {
        return Promise.resolve(true);
    },
	read (opts) {
        this.content = '';
        io.File.processHooks('read', this, opts);
		return this.content;
	},
	
	readAsync (opts){
        this.content = '';
        const dfr = new Deferred;
        io.File.processHooks('readAsync', this, opts, (error) => {
            if (error) {
                dfr.reject(error);
                return;
            }
            dfr.resolve(this.content);
        });
	},
    write () {
        throw new Error ('Middleware implements no write-logic');
    },
    writeAsync () {
        throw new Error ('Middleware implements no write-logic');
    },
    copyTo (path) {
        this.read();
        this.write(this.content, path);
    },
    copyAsync (path) {
        return this
            .readAsync()
            .then(() => this.writeAsync(this.content, path));
    },
});;
				
					_src_class_VirtualFile = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_AtmaServer;
				(function () {
					var exports = {};
					var module = { exports: exports };
					import { utils, io } from './package-private.js';

export default class AtmaServer {
    static attach (app, extMap, middleware, opts) {
        options = opts;
        Object.keys(extMap).forEach(ext => {
            if (ext[0] !== '/') {
                var rgx = `\\.${ext}($|\\?)`;
                var rgx_map = `\\.${ext}\\.map($|\\?)`;
                app.handlers.registerHandler(rgx, HttpHandler);
                app.handlers.registerHandler(rgx_map, HttpHandler);
                return;
            }
            app.handlers.registerHandler(ext, HttpHandler);
        })
    }
}

let options = null;
let File = io.File;

class HttpHandler extends utils.class_Dfr {

    process (req, res, config) {
        var handler = this,
            url = req.url,
            q = req.url.indexOf('?');
        if (q !== -1) {
            url = url.substring(0, q);
        }
        var isSourceMap = url.substr(-4) === '.map';
        if (isSourceMap)  {
            url = url.substring(0, url.length - 4);
        }
        if (url[0] === '/') {
            url = url.substring(1);
        }
        if (config.base) {
            options.base = config.base;
        }
        
        try_createFileInstance_viaStatic(config, url, onSuccess, try_Static);
        
        function try_Static(){
            try_createFileInstance_byConfig(config, 'static', url, onSuccess, try_Base);
        }
        function try_Base() {
            try_createFileInstance_byConfig(config, 'base', url, onSuccess, try_Cwd);
        }
        function try_Cwd() {
            try_createFileInstance(process.cwd(), url, onSuccess, onFailure);
        }
        function onFailure(){
            handler.reject('Not Found - ' + url, 404, 'text/plain');
        }
        function onSuccess(file){
            var fn = file.readAsync;
            if (isSourceMap && file.readSourceMapAsync) 
                fn = file.readSourceMapAsync;
            
            fn
                .call(file)
                .fail(handler.rejectDelegate())
                .done(function(){
                    var source = isSourceMap
                        ? file.sourceMap
                        : file.content;
                        
                    var mimeType = isSourceMap
                        ? 'application/json'
                        : (file.mimeType || options.mimeType)
                        ;
                        
                    handler.resolve(source, 200, mimeType);
                })
        }
    }
}

function try_createFileInstance(base, url, onSuccess, onFailure) {
    var path = net.Uri.combine(base, url);
    File
        .existsAsync(path)
        .fail(onFailure)
        .done(function(exists){
            if (exists) 
                return onSuccess(new File(path));
            onFailure();
        });
};
function try_createFileInstance_byConfig(config, property, url, onSuccess, onFailure){
    var base = config && config[property];
    if (base == null) {
        onFailure();
        return;
    }
    try_createFileInstance(base, url, onSuccess, onFailure);
}
function try_createFileInstance_viaStatic(config, url, onSuccess, onFailure){
    if (_resolveStaticPath === void 0) {
        var x;
        _resolveStaticPath = (x = global.atma)
            && (x = x.server)
            && (x = x.StaticContent)
            && (x = x.utils)
            && (x = x.resolvePath)
            ;
    }
    if (_resolveStaticPath == null) {
        onFailure();
        return;
    }
    var file = new io.File(_resolveStaticPath(url, config));
    if (file.exists() === false) {
        onFailure();
        return;
    }
    onSuccess(file);
}
var _resolveStaticPath;;
				
					_src_AtmaServer = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_class_Middleware;
				(function () {
					var exports = {};
					var module = { exports: exports };
					const SourceMapFile = _src_class_SourceMapFile;
const VirtualFile = _src_class_VirtualFile;
const AtmaServer = _src_AtmaServer;

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
		this.middlewareDefintion = middlewareDefintion;
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
			extensions = normalizeExtensions(extensions, this.name);
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
		let extensionsMap = normalizeExtensions(extensions, this.name);

		registerExtensions(io.File, extensionsMap, sourceMap);	

		if (this.middlewareDefintion.isVirtualHandler) {
			VirtualFile.register(io, extensionsMap, this.middlewareDefintion);
		}	
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
function normalizeExtensions (mix, name) {
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
	File.registerExtensions(extMap);
	
	if (withSourceMap) {
		for (let ext in map) {
			File.getFactory().registerHandler(
				new RegExp('\\.' + ext + '.map$', 'i')
				, SourceMapFile
			); 
		}
	}
}
;
				
					_src_class_Middleware = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_create;
				(function () {
					var exports = {};
					var module = { exports: exports };
					let ConfigProvider = _src_ConfigProvider;
let Compiler = _src_Compiler;
let Middleware = _src_class_Middleware;
let VirtualFile = _src_class_VirtualFile;
let { io, utils: { is_String, is_Function } } = _src_package_private;

/**
 * @middlewareDefintion {
 * 	name: string
 *  process (content, path, options, ctx: { file, method })
 *  processAsync (content, path, options, ctx: { file, method }, done)
 * 	defaultOptions: {}
 *  textOnly: true "Should serialize content if some previous middleware parsed it to some struct"
 * }
 */
module.exports = function(middlewareDefintion, io_) {
	let { name, process, processAsync } = middlewareDefintion;
	if (is_String(name) === false) {
		throw Error('Middleware is not valid. Name is undefined');
	}	
	if (is_Function(process) === false && is_Function(processAsync) === false) {
		throw Error('Middleware is not valid. At least `process` or `processAsync` methods are expected');
	}
	let config = new ConfigProvider(name, middlewareDefintion.defaultOptions);
	let options = config.load();
	if (options == null) {
		throw Error(`Options for the ${name} middleware are not resolved.`);
	}
	
	let compiler = new Compiler(middlewareDefintion, options);
	let middleware = new Middleware(middlewareDefintion, options, compiler);
	let ioLib = io_ || io;
	if (ioLib != null) {
		middleware.register(io);
	}
	return middleware;
};;
				
					_src_create = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				
let create = _src_create;

module.exports = {
	create
};



				
				}());
				// end:source ./templates/RootModule.js
				