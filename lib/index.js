
				// source ./templates/RootModule.js
				(function(){
					
					var _src_AtmaServer = {};
var _src_Compiler = {};
var _src_ConfigProvider = {};
var _src_class_Logger = {};
var _src_class_Middleware = {};
var _src_class_SourceMapFile = {};
var _src_class_VirtualFile = {};
var _src_create = {};
var _src_dependencies = {};
var _src_utils_regexp = {};

				// source ./templates/ModuleSimplified.js
				var _src_dependencies;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IO = require("atma-io");
var utils = require("atma-utils");
exports.utils = utils;
var globalIo = global.io;
var io = globalIo && globalIo.File ? globalIo : IO;
exports.io = io;
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_dependencies) && isObject(module.exports)) {
						Object.assign(_src_dependencies, module.exports);
						return;
					}
					_src_dependencies = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_ConfigProvider;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var appcfg = require("appcfg");
var atma_utils_1 = require("atma-utils");
var ConfigProvider = (function () {
    function ConfigProvider(name, defaultOptions) {
        this.name = name;
        this.defaultOptions = defaultOptions;
        this.name = name;
    }
    ConfigProvider.prototype.load = function () {
        var defaultOptions = this.defaultOptions;
        var packageOptions = PackageLoader.load(this.name);
        var globalOptions = GlobalLoader.load(this.name);
        return atma_utils_1.obj_extendMany({}, defaultOptions, packageOptions, globalOptions);
    };
    return ConfigProvider;
}());
exports.default = ConfigProvider;
var PackageLoader = (function () {
    function PackageLoader() {
    }
    PackageLoader.load = function (name) {
        var cfg = appcfg.fetch([{ path: 'package.json', optional: true }], { sync: true });
        return Utils.readOptions(cfg, name);
    };
    return PackageLoader;
}());
var GlobalLoader = (function () {
    function GlobalLoader() {
    }
    GlobalLoader.load = function (name) {
        var _ = global;
        var cfg = _.app && _.app.config || _.config;
        return Utils.readOptions(cfg, name);
    };
    return GlobalLoader;
}());
var Utils;
(function (Utils) {
    function readOptions(cfg, name) {
        if (cfg == null) {
            return null;
        }
        if (cfg.$get) {
            return cfg.$get("" + name)
                || cfg.$get("settings." + name)
                || cfg.$get("atma.settings." + name);
        }
        return (cfg[name])
            || (cfg.settings && cfg.settings[this.name])
            || (cfg.atma && cfg.atma.settings && cfg.atma.settings[this.name]);
    }
    Utils.readOptions = readOptions;
    ;
})(Utils = exports.Utils || (exports.Utils = {}));
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_ConfigProvider) && isObject(module.exports)) {
						Object.assign(_src_ConfigProvider, module.exports);
						return;
					}
					_src_ConfigProvider = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_class_Logger;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var dependencies_1 = _src_dependencies;
function createLogger(options) {
    if (options === void 0) { options = { type: 'std' }; }
    switch (options.type) {
        case 'silent':
            return new SilentLogger(options);
        case 'file':
            return new FileLogger(options);
        case 'custom':
            return new CustomLogger(options);
        case 'std':
        default:
            return new StdLogger(options);
    }
}
exports.createLogger = createLogger;
;
var ILogger = (function () {
    function ILogger(options) {
        this.options = options;
    }
    ILogger.prototype.start = function () {
        if (this.options.interceptStd) {
            Interceptor.hook(this);
        }
    };
    ILogger.prototype.end = function () {
        if (this.options.interceptStd) {
            Interceptor.unhook();
        }
    };
    ILogger.prototype.delegateEnd = function (onComplete) {
        var _this = this;
        if (onComplete == null) {
            return null;
        }
        return function (error) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (error != null) {
                _this.write(error.message);
            }
            _this.end();
            onComplete.apply(null, [error].concat(args));
        };
    };
    return ILogger;
}());
exports.ILogger = ILogger;
;
var StdLogger = (function (_super) {
    __extends(StdLogger, _super);
    function StdLogger() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StdLogger.prototype.write = function (x) {
        console.log(x);
    };
    return StdLogger;
}(ILogger));
exports.StdLogger = StdLogger;
var SilentLogger = (function (_super) {
    __extends(SilentLogger, _super);
    function SilentLogger(opts) {
        var _this = _super.call(this, opts) || this;
        _this.options.interceptStd = true;
        return _this;
    }
    SilentLogger.prototype.write = function (x) {
    };
    return SilentLogger;
}(ILogger));
exports.SilentLogger = SilentLogger;
;
var FileLogger = (function (_super) {
    __extends(FileLogger, _super);
    function FileLogger() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.buffer = [];
        return _this;
    }
    FileLogger.prototype.lock = function () {
    };
    FileLogger.prototype.release = function () {
        dependencies_1.io.File.write(this.options.file, this.buffer.join('\n'));
    };
    FileLogger.prototype.write = function (str) {
        this.buffer.push(str);
    };
    return FileLogger;
}(SilentLogger));
;
var CustomLogger = (function (_super) {
    __extends(CustomLogger, _super);
    function CustomLogger(opts) {
        var _this = _super.call(this, opts) || this;
        if (typeof _this.options.write !== 'function') {
            throw Error('Custom logger should export the `write` method');
        }
        return _this;
    }
    CustomLogger.prototype.write = function (x) {
        this.options.write(x);
    };
    return CustomLogger;
}(SilentLogger));
var Interceptor;
(function () {
    var _process = global.process;
    var _stdOutWrite = _process.stdout.write;
    var _stdErrWrite = _process.stderr.write;
    var _currentListener = null;
    Interceptor = {
        hook: function (listener) {
            _currentListener = listener;
            setMethods(onStdOut, onStdErr);
        },
        unhook: function () {
            setMethods(null, null);
        }
    };
    function setMethods(stdOutFn, stdErrFn) {
        _process.stdout.write = stdOutFn || _stdOutWrite;
        _process.stderr.write = stdErrFn || _stdErrWrite;
    }
    function onStdOut(str) {
        if (_currentListener == null) {
            return;
        }
        _currentListener.write('stdout', str);
    }
    ;
    function onStdErr(str) {
        if (_currentListener == null) {
            return;
        }
        _currentListener.write('stderr', str);
    }
}());
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_class_Logger) && isObject(module.exports)) {
						Object.assign(_src_class_Logger, module.exports);
						return;
					}
					_src_class_Logger = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_Compiler;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Logger_1 = _src_class_Logger;
var atma_utils_1 = require("atma-utils");
var Compiler = (function () {
    function Compiler(middlewareDefinition, options) {
        this.middlewareDefinition = middlewareDefinition;
        this.options = options;
        /** Single temp Configuration: will be passt on each io File read/write calls */
        this.currentConfig = null;
        var name = middlewareDefinition.name, process = middlewareDefinition.process, processAsync = middlewareDefinition.processAsync, _a = middlewareDefinition.textOnly, textOnly = _a === void 0 ? true : _a;
        this.middlewareDefinition = middlewareDefinition;
        this.process_ = process;
        this.processAsync_ = processAsync;
        this.name = name;
        this.textOnly = textOnly;
        this.setOptions(options);
    }
    Compiler.prototype.setOptions = function (opts) {
        this.logger = Logger_1.createLogger(this.options.logger || this.middlewareDefinition.defaultOptions.logger);
        this.options = opts;
        this.currentConfig = null;
    };
    Compiler.prototype.getOption = function (property) {
        if (this.currentConfig != null) {
            var options = atma_utils_1.obj_getProperty(this.currentConfig, "settings." + this.name)
                || atma_utils_1.obj_getProperty(this.currentConfig, "" + this.name)
                || this.currentConfig;
            var x = atma_utils_1.obj_getProperty(options, property);
            if (x != null) {
                return x;
            }
        }
        return atma_utils_1.obj_getProperty(this.options, property);
    };
    Compiler.prototype.onMount = function (io) {
        this.middlewareDefinition.onMount && this.middlewareDefinition.onMount(io);
    };
    Compiler.prototype.compile = function (file, config) {
        this.currentConfig = config;
        var result = this.process_(this.getContent_(file), file, this);
        this.applyResult_(file, result);
        return null;
    };
    Compiler.prototype.compileAsync = function (file, config, done) {
        var _this = this;
        this.currentConfig = config;
        var fn = this.processAsync_;
        if (fn == null) {
            try {
                var result = this.compile(file, config);
                this.applyResult_(file, result);
                done();
            }
            catch (error) {
                done(error);
            }
            return;
        }
        this
            .processAsync_(this.getContent_(file), file, this)
            .then(function (result) {
            _this.applyResult_(file, result);
            done();
        }, function (error) { return done(error); });
    };
    Compiler.prototype.applyResult_ = function (file, result) {
        if (result == null) {
            return;
        }
        if (typeof result === 'string') {
            file.content = result;
            return;
        }
        file.sourceMap = result.sourceMap;
        file.content = result.content;
    };
    Compiler.prototype.getContent_ = function (file) {
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
    };
    return Compiler;
}());
exports.default = Compiler;
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_Compiler) && isObject(module.exports)) {
						Object.assign(_src_Compiler, module.exports);
						return;
					}
					_src_Compiler = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_class_SourceMapFile;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var dependencies_1 = _src_dependencies;
var atma_utils_1 = require("atma-utils");
var SourceMapFile = (function (_super) {
    __extends(SourceMapFile, _super);
    function SourceMapFile() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SourceMapFile.prototype.read = function (opts) {
        if (this.exists('mapOnly'))
            return _super.prototype.read.call(this, opts);
        var path = this.getSourcePath();
        if (path == null)
            return null;
        var file = new dependencies_1.io.File(path);
        file.read(opts);
        return (this.content = file.sourceMap);
    };
    SourceMapFile.prototype.readAsync = function (opts) {
        var _this = this;
        if (this.exists('mapOnly'))
            return _super.prototype.readAsync.call(this, opts);
        var path = this.getSourcePath();
        if (path == null) {
            return new atma_utils_1.class_Dfr().reject({
                code: 404,
                filename: this.uri.toLocalFile(),
                message: 'Path equals original'
            });
        }
        var file = new dependencies_1.io.File(path);
        var prom = file.readAsync(opts);
        return prom.then(function () {
            return (_this.content = file.sourceMap);
        });
    };
    SourceMapFile.prototype.exists = function (check) {
        if (_super.prototype.exists.call(this))
            return true;
        if (check === 'mapOnly')
            return false;
        var path = this.getSourcePath();
        return path != null
            ? dependencies_1.io.File.exists(path)
            : false;
    };
    SourceMapFile.prototype.getSourcePath = function () {
        var path = this.uri.toString(), source = path.replace(/\.map$/i, '');
        return path === source
            ? null
            : source;
    };
    return SourceMapFile;
}(dependencies_1.io.File));
exports.default = SourceMapFile;
;
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_class_SourceMapFile) && isObject(module.exports)) {
						Object.assign(_src_class_SourceMapFile, module.exports);
						return;
					}
					_src_class_SourceMapFile = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_utils_regexp;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function toRegexp(misc) {
    if (misc[0] === '/') {
        var str = misc.substring(1);
        var end = str.lastIndexOf('/');
        var flags = str.substring(end + 1);
        str = str.substring(0, end);
        return new RegExp(str, flags);
    }
    var rgx = "\\." + misc + "($|\\?|#)";
    return new RegExp(rgx);
}
exports.toRegexp = toRegexp;
;
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_utils_regexp) && isObject(module.exports)) {
						Object.assign(_src_utils_regexp, module.exports);
						return;
					}
					_src_utils_regexp = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_class_VirtualFile;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var dependencies_1 = _src_dependencies;
var atma_utils_1 = require("atma-utils");
var regexp_1 = _src_utils_regexp;
function register(io, extMap, middlewareDefinition) {
    var Ctor = atma_utils_1.class_create(VirtualFile, middlewareDefinition.VirtualFile);
    Object.keys(extMap).forEach(function (ext) {
        io.File.getFactory().registerHandler(regexp_1.toRegexp(ext), Ctor);
    });
}
exports.register = register;
;
var VirtualFile = (function (_super) {
    __extends(VirtualFile, _super);
    function VirtualFile() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    VirtualFile.prototype.exists = function () {
        return true;
    };
    VirtualFile.prototype.existsAsync = function () {
        return atma_utils_1.class_Dfr.resolve(true);
    };
    VirtualFile.prototype.read = function (opts) {
        this.content = '';
        dependencies_1.io.File.processHooks('read', this, opts, null);
        return this.content;
    };
    VirtualFile.prototype.readAsync = function (opts) {
        var _this = this;
        this.content = '';
        var dfr = new atma_utils_1.class_Dfr();
        dependencies_1.io.File.processHooks('read', this, opts, function (error) {
            if (error) {
                dfr.reject(error);
                return;
            }
            dfr.resolve(_this.content);
        });
        return dfr;
    };
    VirtualFile.prototype.write = function (content, opts) {
        throw new Error('Middleware implements no write-logic');
    };
    VirtualFile.prototype.writeAsync = function (content, opts) {
        throw new Error('Middleware implements no write-logic');
    };
    VirtualFile.prototype.copyTo = function (path) {
        this.read(null);
        this.write(this.content, path);
        return this;
    };
    VirtualFile.prototype.copyAsync = function (path) {
        var _this = this;
        return this
            .readAsync(null)
            .then(function () {
            return _this.writeAsync(_this.content, path);
        });
    };
    return VirtualFile;
}(dependencies_1.io.File));
;
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_class_VirtualFile) && isObject(module.exports)) {
						Object.assign(_src_class_VirtualFile, module.exports);
						return;
					}
					_src_class_VirtualFile = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_AtmaServer;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var atma_utils_1 = require("atma-utils");
var dependencies_1 = _src_dependencies;
var AtmaServer = (function () {
    function AtmaServer() {
    }
    AtmaServer.attach = function (app, extMap, middleware, opts) {
        options = opts;
        Object.keys(extMap).forEach(function (ext) {
            if (ext[0] !== '/') {
                var rgx = "\\." + ext + "($|\\?)";
                var rgx_map = "\\." + ext + "\\.map($|\\?)";
                app.handlers.registerHandler(rgx, HttpHandler);
                app.handlers.registerHandler(rgx_map, HttpHandler);
                return;
            }
            app.handlers.registerHandler(ext, HttpHandler);
        });
    };
    return AtmaServer;
}());
exports.default = AtmaServer;
var options = null;
var HttpHandler = (function (_super) {
    __extends(HttpHandler, _super);
    function HttpHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HttpHandler.prototype.process = function (req, res, config) {
        var handler = this, url = req.url, q = req.url.indexOf('?');
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
            if (isSourceMap && file.readSourceMapAsync)
                fn = file.readSourceMapAsync;
            fn
                .call(file)
                .fail(handler.rejectDelegate())
                .done(function () {
                var source = isSourceMap
                    ? file.sourceMap
                    : file.content;
                var mimeType = isSourceMap
                    ? 'application/json'
                    : (file.mimeType || options.mimeType);
                handler.resolve(source, 200, mimeType);
            });
        }
    };
    return HttpHandler;
}(atma_utils_1.class_Dfr));
function try_createFileInstance(base, url, onSuccess, onFailure) {
    var path = dependencies_1.io.Uri.combine(base, url);
    dependencies_1.io.File
        .existsAsync(path)
        .then(function (exists) {
        if (exists)
            return onSuccess(new dependencies_1.io.File(path));
        onFailure();
    }, onFailure);
}
;
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
        _resolveStaticPath = (x = global.atma)
            && (x = x.server)
            && (x = x.StaticContent)
            && (x = x.utils)
            && (x = x.resolvePath);
    }
    if (_resolveStaticPath == null) {
        onFailure();
        return;
    }
    var file = new dependencies_1.io.File(_resolveStaticPath(url, config));
    if (file.exists() === false) {
        onFailure();
        return;
    }
    onSuccess(file);
}
var _resolveStaticPath;
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_AtmaServer) && isObject(module.exports)) {
						Object.assign(_src_AtmaServer, module.exports);
						return;
					}
					_src_AtmaServer = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_class_Middleware;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SourceMapFile_1 = _src_class_SourceMapFile;
var VirtualFile_1 = _src_class_VirtualFile;
var AtmaServer_1 = _src_AtmaServer;
var atma_utils_1 = require("atma-utils");
var ConfigProvider_1 = _src_ConfigProvider;
var _currentIo = null;
var Middleware = (function () {
    function Middleware(middlewareDefintion, options, compiler) {
        this.middlewareDefintion = middlewareDefintion;
        this.options = options;
        this.compiler = compiler;
        var name = middlewareDefintion.name;
        this.options = atma_utils_1.obj_extendMany({}, middlewareDefintion.defaultOptions, options);
        this.name = name;
    }
    Middleware.prototype.process = function (file, config) {
        this.compiler.compile(file, config);
    };
    Middleware.prototype.processAsync = function (file, config, done) {
        this.compiler.compileAsync(file, config, done);
    };
    Middleware.prototype.init = function (io_, extraOptions) {
        _currentIo = io_;
        io_.File.middleware[this.name] = this;
        var opts = this.options;
        if (extraOptions) {
            this.setOptions(extraOptions);
        }
        var extensions = opts.extensions, sourceMap = opts.sourceMap;
        var extensionsMap = normalizeExtensions(extensions, this.name);
        registerExtensions(io_.File, extensionsMap, sourceMap);
        if (this.middlewareDefintion.isVirtualHandler) {
            VirtualFile_1.register(io_, extensionsMap, this.middlewareDefintion);
        }
        this.compiler.onMount(_currentIo);
    };
    /** Atma-Server */
    Middleware.prototype.attach = function (app) {
        var globalOpts = atma_utils_1.obj_extend({}, this.options);
        var appOptions = app.config && (app.config.$get("settings." + this.name) || app.config.$get("" + this.name));
        if (appOptions) {
            globalOpts = atma_utils_1.obj_extend(globalOpts, appOptions);
        }
        var extensions = globalOpts.extensions;
        if (extensions) {
            extensions = normalizeExtensions(extensions, this.name);
        }
        AtmaServer_1.default.attach(app, extensions, this, globalOpts);
    };
    /** Atma.Plugin */
    Middleware.prototype.register = function (appcfg) {
        var extraOptions = ConfigProvider_1.Utils.readOptions(appcfg, this.name);
        if (extraOptions == null) {
            return;
        }
        this.setOptions(extraOptions);
        var extensions = extraOptions.extensions, sourceMap = extraOptions.sourceMap;
        if (extensions) {
            var extensionsMap = normalizeExtensions(extensions, this.name);
            if (_currentIo) {
                registerExtensions(_currentIo.File, extensionsMap, sourceMap);
            }
        }
    };
    /** IO **/
    Middleware.prototype.read = function (file, config) {
        this.process(file, config);
    };
    Middleware.prototype.readAsync = function (file, config, done) {
        this.processAsync(file, config, done);
    };
    Middleware.prototype.write = function (file, config) {
        this.process(file, config);
    };
    Middleware.prototype.writeAsync = function (file, config, done) {
        this.processAsync(file, config, done);
    };
    Middleware.prototype.setOptions = function (opts) {
        this.options = atma_utils_1.obj_extendMany({}, this.middlewareDefintion.defaultOptions, opts);
        this.compiler.setOptions(this.options);
    };
    return Middleware;
}());
exports.default = Middleware;
;
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
        mix.forEach(function (ext) { return map[ext] = [name + ":read"]; });
        return map;
    }
    var _loop_1 = function (ext) {
        var str = mix[ext] || 'read', types = void 0;
        if (str.indexOf(',') > -1) {
            types = str.trim().split(',').map(function (x) { return x.trim(); });
        }
        else {
            types = [str.trim()];
        }
        map[ext] = [];
        types.forEach(function (type) { return map[ext].push(name + ":" + type); });
    };
    for (var ext in mix) {
        _loop_1(ext);
    }
    return map;
}
function registerExtensions(File, extMap, withSourceMap) {
    if (withSourceMap === void 0) { withSourceMap = false; }
    File.registerExtensions(extMap);
    if (withSourceMap) {
        for (var ext in extMap) {
            File.getFactory().registerHandler(new RegExp('\\.' + ext + '.map$', 'i'), SourceMapFile_1.default);
        }
    }
}
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_class_Middleware) && isObject(module.exports)) {
						Object.assign(_src_class_Middleware, module.exports);
						return;
					}
					_src_class_Middleware = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_create;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var atma_utils_1 = require("atma-utils");
var dependencies_1 = _src_dependencies;
var ConfigProvider_1 = _src_ConfigProvider;
var Compiler_1 = _src_Compiler;
var Middleware_1 = _src_class_Middleware;
/**
 * @middlewareDefintion {
 * 	name: string
 *  process (content, path, options, ctx: { file, method })
 *  processAsync (content, path, options, ctx: { file, method }, done)
 * 	defaultOptions: {}
 *  textOnly: true "Should serialize content if some previous middleware parsed it to some struct"
 * }
 */
function create(middlewareDefintion, IO) {
    var name = middlewareDefintion.name, process = middlewareDefintion.process, processAsync = middlewareDefintion.processAsync;
    if (atma_utils_1.is_String(name) === false) {
        throw Error('Middleware is not valid. Name is undefined');
    }
    if (atma_utils_1.is_Function(process) === false && atma_utils_1.is_Function(processAsync) === false) {
        throw Error('Middleware is not valid. At least `process` or `processAsync` methods are expected');
    }
    var config = new ConfigProvider_1.default(name, middlewareDefintion.defaultOptions);
    var options = config.load();
    if (options == null) {
        throw Error("Options for the " + name + " middleware are not resolved.");
    }
    var compiler = new Compiler_1.default(middlewareDefintion, options);
    var middleware = new Middleware_1.default(middlewareDefintion, options, compiler);
    var ioLib = IO || dependencies_1.io;
    if (ioLib != null) {
        middleware.init(dependencies_1.io);
    }
    return middleware;
}
exports.default = create;
;
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_create) && isObject(module.exports)) {
						Object.assign(_src_create, module.exports);
						return;
					}
					_src_create = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var create_1 = _src_create;
exports.create = create_1.default;

				
				}());
				// end:source ./templates/RootModule.js
				