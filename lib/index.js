
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

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var appcfg = require('appcfg');
var EventEmitter = require('events');
var States = { LOADING: 1, LOADED: 2, CUSTOM: 3 };

var ConfigProvider = function (_EventEmitter) {
	_inherits(ConfigProvider, _EventEmitter);

	function ConfigProvider(name, defaultOptions) {
		_classCallCheck(this, ConfigProvider);

		var _this = _possibleConstructorReturn(this, (ConfigProvider.__proto__ || Object.getPrototypeOf(ConfigProvider)).call(this));

		_this.name = name;
		_this.options = defaultOptions;
		_this.state = States.LOADING;
		return _this;
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
}(EventEmitter);

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
		value: function compile(file, options) {
			var result = this.process_('middleware_', file, options);
			this.applyResult_(file, result);
		}
	}, {
		key: 'compileAsync',
		value: function compileAsync(file, options, done) {
			var _this = this;

			this.process_('middlewareAsync_', file, options, function (error, result) {
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
		value: function process_(method, file, options, done) {
			var content = this.getContent_(file);
			var opts = this.options;
			if (options) {
				opts = Object.assign(opts, options);
			}
			var path = file.uri.toLocalFile();
			var ctx = { file: file, method: method };
			return this[method](content, path, opts, ctx, done);
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
	utils: require('atma-utils')
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
				var _src_class_Middleware;
				(function () {
					var exports = {};
					var module = { exports: exports };
					'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SourceMapFile = _src_class_SourceMapFile;

module.exports = function () {
	function Middleware(middlewareDefintion, options, compiler) {
		_classCallCheck(this, Middleware);

		var name = middlewareDefintion.name,
		    extensions = middlewareDefintion.extensions;


		this.options = options;
		this.compiler = compiler;
		this.name = name;
		this.extensions = extensions;
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
	}, {
		key: 'register',
		value: function register(io) {
			if (io == null) {
				return;
			}
			var File = io.File;
			var name = this.name,
			    extensions = this.extensions;

			File.middleware[name] = this;
			if (extensions) {
				var map = {};
				var mix = extensions;
				if (Array.isArray(mix)) {
					extensions.forEach(function (ext) {
						return map[ext] = [name + ':read'];
					});
				} else {
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
						var definitions = map[ext] = [];
						types.forEach(function (type) {
							return definitions.push(name + ':' + type);
						});
					};

					for (var ext in mix) {
						_loop(ext);
					}
				}
				File.registerExtensions(map);
				if (this.options.sourceMap) {
					for (var ext in map) {
						Factory.registerHandler(new RegExp('\\.' + ext + '.map$', 'i'), SourceMapFile);
					}
				}
			}
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
	}]);

	return Middleware;
}();;
				
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

var _require = _src_package_private,
    io = _require.io,
    _require$utils = _require.utils,
    is_String = _require$utils.is_String,
    is_Function = _require$utils.is_Function;

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
				