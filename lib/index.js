
				// source ./templates/RootModule.js
				(function(){
					
					
				// source ./templates/ModuleSimplified.js
				var _src_ConfigProvider;
				(function () {
					var exports = {};
					var module = { exports: exports };
					'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var appcfg = require('appcfg');

var ConfigProvider = function () {
	function ConfigProvider(name, defaultOptions) {
		_classCallCheck(this, ConfigProvider);

		this.name = name;
		this.options = defaultOptions;
	}

	_createClass(ConfigProvider, [{
		key: 'load',
		value: function load() {
			var defaultOptions = this.options;
			var packageOptions = PackageLoader.load(this.name);
			var globalOptions = GlobalLoader.load(this.name);

			return Utils.extendOptions(defaultOptions, packageOptions, globalOptions);
		}
	}]);

	return ConfigProvider;
}();

var PackageLoader = function () {
	function PackageLoader() {
		_classCallCheck(this, PackageLoader);
	}

	_createClass(PackageLoader, null, [{
		key: 'load',
		value: function load(name) {
			var cfg = appcfg.fetch([{ path: 'package.json', optional: true }], { sync: true });
			return Utils.readOptions(cfg, name);
		}
	}]);

	return PackageLoader;
}();

var GlobalLoader = function () {
	function GlobalLoader() {
		_classCallCheck(this, GlobalLoader);
	}

	_createClass(GlobalLoader, null, [{
		key: 'load',
		value: function load(name) {
			var cfg = global.app && global.app.config || global.config;
			return Utils.readOptions(cfg, name);
		}
	}]);

	return GlobalLoader;
}();

var Utils = function () {
	function Utils() {
		_classCallCheck(this, Utils);
	}

	_createClass(Utils, null, [{
		key: 'readOptions',
		value: function readOptions(cfg, name) {
			if (cfg == null) {
				return null;
			}
			if (cfg.$get) {
				return cfg.$get('' + name) || cfg.$get('settings.' + name) || cfg.$get('atma.settings.' + name);
			}
			return cfg[name] || cfg.settings && cfg.settings[this.name] || cfg.atma && cfg.atma.settings && cfg.atma.settings[this.name];
		}
	}, {
		key: 'extendOptions',
		value: function extendOptions(a, b) {
			if (b == null) {
				return a;
			}
			return Object.assign(a || {}, b);
		}
	}]);

	return Utils;
}();

module.exports = ConfigProvider;;
				
					_src_ConfigProvider = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_Compiler;
				(function () {
					var exports = {};
					var module = { exports: exports };
					'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function () {
	function Compiler(middlewareDefinition, options) {
		_classCallCheck(this, Compiler);

		this.options = options;

		var process = middlewareDefinition.process,
		    processAsync = middlewareDefinition.processAsync,
		    _middlewareDefinition = middlewareDefinition.textOnly,
		    textOnly = _middlewareDefinition === undefined ? true : _middlewareDefinition;

		this.middleware_ = process;
		this.middlewareAsync_ = processAsync;
		this.textOnly = textOnly;
	}

	_createClass(Compiler, [{
		key: 'setOptions',
		value: function setOptions(opts) {
			this.options = opts;
		}
	}, {
		key: 'middleware_',
		value: function middleware_(content, path, options, ctx) {
			throw Error('Not implemented');
			return { content: null, sourceMap: null };
		}
	}, {
		key: 'middlewareAsync_',
		value: function middlewareAsync_(content, path, options, ctx, done) {
			try {
				this.compile(file, options);
			} catch (error) {
				done(error);
				return;
			}
			done(null, file);
		}
	}, {
		key: 'compile',
		value: function compile(file, config) {
			var result = this.process_('middleware_', file, config);
			this.applyResult_(file, result);
		}
	}, {
		key: 'compileAsync',
		value: function compileAsync(file, config, done) {
			var _this = this;

			this.process_('middlewareAsync_', file, config, function (error, result) {
				if (error) {
					done(error);
					return;
				}
				_this.applyResult_(file, result);
				done(null, result);
			});
		}
	}, {
		key: 'process_',
		value: function process_(method, file, config, done) {
			return this[method](this.getContent_(file), file.uri.toLocalFile(), this.options, { file: file, method: method, config: config }, done);
		}
	}, {
		key: 'applyResult_',
		value: function applyResult_(file, result) {
			file.sourceMap = result.sourceMap;
			file.content = result.content;
		}
	}, {
		key: 'getContent_',
		value: function getContent_(file) {
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
	}]);

	return Compiler;
}();;
				
					_src_Compiler = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_package_private;
				(function () {
					var exports = {};
					var module = { exports: exports };
					'use strict';

module.exports = {
	io: global.io && global.io.File ? global.io : require('atma-io'),
	utils: require('atma-utils'),
	toRegexp: function toRegexp(misc) {
		if (misc[0] === '/') {
			var str = misc.substring(1);
			var end = str.lastIndexOf('/');
			var flags = str.substring(end + 1);
			str = str.substring(0, end);
			return new RegExp(str, flags);
		}
		var rgx = '\\.' + misc + '($|\\?|#)';
		return new RegExp(rgx);
	}
};;
				
					_src_package_private = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_class_SourceMapFile;
				(function () {
					var exports = {};
					var module = { exports: exports };
					'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = _src_package_private,
    File = _require.io.File;

var _require2 = require('atma-utils'),
    Deferred = _require2.class_Dfr;

module.exports = function (_File) {
	_inherits(SourceMapFile, _File);

	function SourceMapFile() {
		_classCallCheck(this, SourceMapFile);

		return _possibleConstructorReturn(this, (SourceMapFile.__proto__ || Object.getPrototypeOf(SourceMapFile)).apply(this, arguments));
	}

	_createClass(SourceMapFile, [{
		key: 'read',
		value: function read(opts) {
			if (this.exists('mapOnly')) return _get(SourceMapFile.prototype.__proto__ || Object.getPrototypeOf(SourceMapFile.prototype), 'read', this).call(this, opts);

			var path = this.getSourcePath();
			if (path == null) return null;

			var file = new File(path);
			file.read(opts);
			return this.content = file.sourceMap;
		}
	}, {
		key: 'readAsync',
		value: function readAsync(opts) {
			var _this2 = this;

			if (this.exists('mapOnly')) return _get(SourceMapFile.prototype.__proto__ || Object.getPrototypeOf(SourceMapFile.prototype), 'readAsync', this).call(this, opts);

			var path = this.getSourcePath();
			if (path == null) return new Deferred.reject({ code: 404 });

			var file = new File(path);
			return file.readAsync(opts).then(function () {
				return _this2.content = file.sourceMap;
			});
		}
	}, {
		key: 'exists',
		value: function exists(check) {
			if (_get(SourceMapFile.prototype.__proto__ || Object.getPrototypeOf(SourceMapFile.prototype), 'exists', this).call(this)) return true;
			if (check === 'mapOnly') return false;

			var path = this.getSourcePath();
			return path != null ? File.exists(path) : false;
		}
	}, {
		key: 'getSourcePath',
		value: function getSourcePath() {
			var path = this.uri.toString(),
			    source = path.replace(/\.map$/i, '');
			return path === source ? null : source;
		}
	}]);

	return SourceMapFile;
}(File);;
				
					_src_class_SourceMapFile = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_class_VirtualFile;
				(function () {
					var exports = {};
					var module = { exports: exports };
					'use strict';

var _require = _src_package_private,
    File = _require.io.File,
    _require$utils = _require.utils,
    class_create = _require$utils.class_create,
    Deferred = _require$utils.class_Dfr,
    toRegexp = _require.toRegexp;

module.exports = {
    register: function register(io, extMap, middlewareDefinition) {
        var Ctor = class_create(VirtualFile, middlewareDefinition.VirtualFile);
        Object.keys(extMap).forEach(function (ext) {
            io.File.getFactory().registerHandler(toRegexp(ext), Ctor);
        });
    }
};

var VirtualFile = class_create(File, {
    exists: function exists() {
        return true;
    },
    existsAsync: function existsAsync() {
        return Promise.resolve(true);
    },
    read: function read(opts) {
        this.content = '';
        io.File.processHooks('read', this, opts);
        return this.content;
    },
    readAsync: function readAsync(opts) {
        var _this = this;

        this.content = '';
        var dfr = new Deferred();
        io.File.processHooks('readAsync', this, opts, function (error) {
            if (error) {
                dfr.reject(error);
                return;
            }
            dfr.resolve(_this.content);
        });
    },
    write: function write() {
        throw new Error('Middleware implements no write-logic');
    },
    writeAsync: function writeAsync() {
        throw new Error('Middleware implements no write-logic');
    },
    copyTo: function copyTo(path) {
        this.read();
        this.write(this.content, path);
    },
    copyAsync: function copyAsync(path) {
        var _this2 = this;

        return this.readAsync().then(function () {
            return _this2.writeAsync(_this2.content, path);
        });
    }
});;
				
					_src_class_VirtualFile = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_AtmaServer;
				(function () {
					var exports = {};
					var module = { exports: exports };
					'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _packagePrivate = _src_package_private;

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AtmaServer = function () {
    function AtmaServer() {
        _classCallCheck(this, AtmaServer);
    }

    _createClass(AtmaServer, null, [{
        key: 'attach',
        value: function attach(app, extMap, middleware, opts) {
            options = opts;
            Object.keys(extMap).forEach(function (ext) {
                if (ext[0] !== '/') {
                    var rgx = '\\.' + ext + '($|\\?)';
                    var rgx_map = '\\.' + ext + '\\.map($|\\?)';
                    app.handlers.registerHandler(rgx, HttpHandler);
                    app.handlers.registerHandler(rgx_map, HttpHandler);
                    return;
                }
                app.handlers.registerHandler(ext, HttpHandler);
            });
        }
    }]);

    return AtmaServer;
}();

exports.default = AtmaServer;


var options = null;
var File = _packagePrivate.io.File;

var HttpHandler = function (_utils$class_Dfr) {
    _inherits(HttpHandler, _utils$class_Dfr);

    function HttpHandler() {
        _classCallCheck(this, HttpHandler);

        return _possibleConstructorReturn(this, (HttpHandler.__proto__ || Object.getPrototypeOf(HttpHandler)).apply(this, arguments));
    }

    _createClass(HttpHandler, [{
        key: 'process',
        value: function (_process) {
            function process(_x, _x2, _x3) {
                return _process.apply(this, arguments);
            }

            process.toString = function () {
                return _process.toString();
            };

            return process;
        }(function (req, res, config) {
            var handler = this,
                url = req.url,
                q = req.url.indexOf('?');
            if (q !== -1) {
                url = url.substring(0, q);
            }
            var isSourceMap = url.substr(-4) === '.map';
            if (isSourceMap) {
                url = url.substring(0, url.length - 4);
            }
            if (url[0] === '/') {
                url = url.substring(1);
            }
            if (config.base) {
                options.base = config.base;
            }

            try_createFileInstance_viaStatic(config, url, onSuccess, try_Static);

            function try_Static() {
                try_createFileInstance_byConfig(config, 'static', url, onSuccess, try_Base);
            }
            function try_Base() {
                try_createFileInstance_byConfig(config, 'base', url, onSuccess, try_Cwd);
            }
            function try_Cwd() {
                try_createFileInstance(process.cwd(), url, onSuccess, onFailure);
            }
            function onFailure() {
                handler.reject('Not Found - ' + url, 404, 'text/plain');
            }
            function onSuccess(file) {
                var fn = file.readAsync;
                if (isSourceMap && file.readSourceMapAsync) fn = file.readSourceMapAsync;

                fn.call(file).fail(handler.rejectDelegate()).done(function () {
                    var source = isSourceMap ? file.sourceMap : file.content;

                    var mimeType = isSourceMap ? 'application/json' : file.mimeType || options.mimeType;

                    handler.resolve(source, 200, mimeType);
                });
            }
        })
    }]);

    return HttpHandler;
}(_packagePrivate.utils.class_Dfr);

function try_createFileInstance(base, url, onSuccess, onFailure) {
    var path = net.Uri.combine(base, url);
    File.existsAsync(path).fail(onFailure).done(function (exists) {
        if (exists) return onSuccess(new File(path));
        onFailure();
    });
};
function try_createFileInstance_byConfig(config, property, url, onSuccess, onFailure) {
    var base = config && config[property];
    if (base == null) {
        onFailure();
        return;
    }
    try_createFileInstance(base, url, onSuccess, onFailure);
}
function try_createFileInstance_viaStatic(config, url, onSuccess, onFailure) {
    if (_resolveStaticPath === void 0) {
        var x;
        _resolveStaticPath = (x = global.atma) && (x = x.server) && (x = x.StaticContent) && (x = x.utils) && (x = x.resolvePath);
    }
    if (_resolveStaticPath == null) {
        onFailure();
        return;
    }
    var file = new _packagePrivate.io.File(_resolveStaticPath(url, config));
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
					'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SourceMapFile = _src_class_SourceMapFile;
var VirtualFile = _src_class_VirtualFile;
var AtmaServer = _src_AtmaServer;

module.exports = function () {
	function Middleware(middlewareDefintion, options, compiler) {
		_classCallCheck(this, Middleware);

		var extensions = middlewareDefintion.extensions,
		    mimeType = middlewareDefintion.mimeType;


		options.extensions = options.extensions || extensions;
		options.mimeType = options.mimeType || mimeType;

		var name = middlewareDefintion.name;

		this.globalOptions = options;

		this.options = Object.assign({}, options);
		this.compiler = compiler;
		this.name = name;
		this.middlewareDefintion = middlewareDefintion;
	}

	_createClass(Middleware, [{
		key: 'process',
		value: function process(file, config) {
			this.compiler.compile(file, config);
		}
	}, {
		key: 'processAsync',
		value: function processAsync(file, config, done) {
			this.compiler.compileAsync(file, config, done);
		}

		/** Atma-Server */

	}, {
		key: 'attach',
		value: function attach(app) {
			var globalOpts = Object.assign({}, this.options);
			var appOptions = app.config && (app.config.$get('settings.' + this.name) || app.config.$get('' + this.name));
			if (appOptions) {
				globalOpts = Object.assign(globalOpts, appOptions);
			}
			var extensions = globalOpts.extensions;
			if (extensions) {
				extensions = normalizeExtensions(extensions, this.name);
			}
			AtmaServer.attach(app, extensions, this, globalOpts);
		}

		/** IO **/

	}, {
		key: 'read',
		value: function read(file, config) {
			this.process(file, config);
		}
	}, {
		key: 'readAsync',
		value: function readAsync(file, config, done) {
			this.processAsync(file, config, done);
		}
	}, {
		key: 'write',
		value: function write(file, config) {
			this.process(file, config);
		}
	}, {
		key: 'writeAsync',
		value: function writeAsync(file, config, done) {
			this.processAsync(file, config, done);
		}
	}, {
		key: 'register',
		value: function register(io, extraOptions) {
			io.File.middleware[this.name] = this;
			var opts = this.options;
			if (extraOptions) {
				this.setOptions(extraOptions);
			}
			var extensions = opts.extensions,
			    sourceMap = opts.sourceMap;

			var extensionsMap = normalizeExtensions(extensions, this.name);

			registerExtensions(io.File, extensionsMap, sourceMap);

			if (this.middlewareDefintion.isVirtualHandler) {
				VirtualFile.register(io, extensionsMap, this.middlewareDefintion);
			}
		}
	}, {
		key: 'setOptions',
		value: function setOptions(opts) {
			this.options = Object.assign({}, this.globalOptions);
			if (opts) {
				this.options = Object.assign(this.options, opts);
			}
			this.compiler.setOptions(this.options);
		}
	}]);

	return Middleware;
}();

/**
 * Prepair Extensions Map Object for the io.File.registerExtensions 
 * @param {Array|Object} mix
 * @return {Object} Example: { fooExt: ['current-midd-name:read'] } 
 */
function normalizeExtensions(mix, name) {
	var map = {};
	if (mix == null) {
		return map;
	}
	if (Array.isArray(mix)) {
		mix.forEach(function (ext) {
			return map[ext] = [name + ':read'];
		});
		return map;
	}

	var _loop = function _loop(ext) {
		var str = mix[ext] || 'read',
		    types = void 0;
		if (str.indexOf(',') > -1) {
			types = str.trim().split(',').map(function (x) {
				return x.trim();
			});
		} else {
			types = [str.trim()];
		}
		map[ext] = [];
		types.forEach(function (type) {
			return map[ext].push(name + ':' + type);
		});
	};

	for (var ext in mix) {
		_loop(ext);
	}
	return map;
}

function registerExtensions(File, extMap) {
	var withSourceMap = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

	File.registerExtensions(extMap);

	if (withSourceMap) {
		for (var ext in map) {
			File.getFactory().registerHandler(new RegExp('\\.' + ext + '.map$', 'i'), SourceMapFile);
		}
	}
};
				
					_src_class_Middleware = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_create;
				(function () {
					var exports = {};
					var module = { exports: exports };
					'use strict';

var ConfigProvider = _src_ConfigProvider;
var Compiler = _src_Compiler;
var Middleware = _src_class_Middleware;
var VirtualFile = _src_class_VirtualFile;

var _require = _src_package_private,
    io = _require.io,
    _require$utils = _require.utils,
    is_String = _require$utils.is_String,
    is_Function = _require$utils.is_Function;

/**
 * @middlewareDefintion {
 * 	name: string
 *  process (content, path, options, ctx: { file, method })
 *  processAsync (content, path, options, ctx: { file, method }, done)
 * 	defaultOptions: {}
 *  textOnly: true "Should serialize content if some previous middleware parsed it to some struct"
 * }
 */


module.exports = function (middlewareDefintion, io_) {
	var name = middlewareDefintion.name,
	    process = middlewareDefintion.process,
	    processAsync = middlewareDefintion.processAsync;

	if (is_String(name) === false) {
		throw Error('Middleware is not valid. Name is undefined');
	}
	if (is_Function(process) === false && is_Function(processAsync) === false) {
		throw Error('Middleware is not valid. At least `process` or `processAsync` methods are expected');
	}
	var config = new ConfigProvider(name, middlewareDefintion.defaultOptions);
	var options = config.load();
	if (options == null) {
		throw Error('Options for the ' + name + ' middleware are not resolved.');
	}

	var compiler = new Compiler(middlewareDefintion, options);
	var middleware = new Middleware(middlewareDefintion, options, compiler);
	var ioLib = io_ || io;
	if (ioLib != null) {
		middleware.register(io);
	}
	return middleware;
};;
				
					_src_create = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				
'use strict';

var create = _src_create;

module.exports = {
	create: create
};
				
				}());
				// end:source ./templates/RootModule.js
				