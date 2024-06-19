
				// source ./templates/RootModule.js
				(function(){
					
					var _src_AtmaServer = {};
var _src_CacheProvider = {};
var _src_Compiler = {};
var _src_ConfigProvider = {};
var _src_class_Logger = {};
var _src_class_Middleware = {};
var _src_class_SourceMapFile = {};
var _src_class_VirtualFile = {};
var _src_create = {};
var _src_dependencies = {};
var _src_utils_path = {};
var _src_utils_regexp = {};

				// source ./templates/ModuleSimplified.js
				var _src_dependencies;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils = require("atma-utils");
exports.utils = utils;
var io = require("atma-io");
var globalIo = global.io;
exports.io = globalIo;
if (globalIo == null || globalIo.File == null) {
    exports.io = globalIo = io;
}
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
				var _src_class_Logger;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
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
var ILogger = /** @class */ (function () {
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
            onComplete.apply(null, __spreadArrays([error], args));
        };
    };
    ILogger.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var message = args.join(' ');
        this.write(message, 'info');
    };
    ILogger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var message = args.join(' ');
        this.write(message, 'warn');
    };
    ILogger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var message = args.join(' ');
        this.write(message, 'error');
    };
    return ILogger;
}());
exports.ILogger = ILogger;
;
var StdLogger = /** @class */ (function (_super) {
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
var SilentLogger = /** @class */ (function (_super) {
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
var FileLogger = /** @class */ (function (_super) {
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
var CustomLogger = /** @class */ (function (_super) {
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
var dependencies_1 = _src_dependencies;
var atma_utils_1 = require("atma-utils");
var Compiler = /** @class */ (function () {
    function Compiler(middlewareDefinition, options) {
        this.middlewareDefinition = middlewareDefinition;
        this.options = options;
        /** Single temp Configuration: will be passt on each io File read/write calls */
        this.currentConfig = null;
        this.io = dependencies_1.io;
        var name = middlewareDefinition.name, process = middlewareDefinition.process, processAsync = middlewareDefinition.processAsync, _a = middlewareDefinition.textOnly, textOnly = _a === void 0 ? true : _a;
        this.middlewareDefinition = middlewareDefinition;
        this.process_ = process;
        this.processAsync_ = processAsync;
        if (options.handlerPath) {
            this.handler = require(atma_utils_1.class_Uri.combine(global.process.cwd(), options.handlerPath));
        }
        this.name = name;
        this.utils = middlewareDefinition.utils;
        this.textOnly = textOnly;
        this.setOptions(options);
    }
    Compiler.prototype.setConfig = function (config) {
        this.currentConfig = config;
        return this;
    };
    Compiler.prototype.setOptions = function (opts) {
        this.logger = Logger_1.createLogger(opts.logger || this.options.logger || this.middlewareDefinition.defaultOptions.logger);
        this.options = opts;
        this.currentConfig = null;
    };
    Compiler.prototype.getOption = function (property) {
        var config = this.getCurrentConfig();
        if (config != null) {
            var x = atma_utils_1.obj_getProperty(config, property);
            if (x != null) {
                return x;
            }
        }
        return atma_utils_1.obj_getProperty(this.options, property);
    };
    Compiler.prototype.getCurrentConfig = function () {
        var _a, _b;
        if (this.currentConfig == null) {
            return null;
        }
        return (_b = (_a = atma_utils_1.obj_getProperty(this.currentConfig, "settings." + this.name)) !== null && _a !== void 0 ? _a : atma_utils_1.obj_getProperty(this.currentConfig, "" + this.name)) !== null && _b !== void 0 ? _b : this.currentConfig;
    };
    Compiler.prototype.onMount = function (io) {
        var _a, _b;
        this.io = io;
        (_b = (_a = this.middlewareDefinition).onMount) === null || _b === void 0 ? void 0 : _b.call(_a, io);
    };
    Compiler.prototype.compile = function (file, config, method) {
        var _a;
        this.currentConfig = config;
        if ((_a = this.handler) === null || _a === void 0 ? void 0 : _a.transformConfig) {
            this.currentConfig = this.handler.transformConfig(file, config, this);
        }
        var result = this.process_(this.getContent_(file), file, this, method);
        this.applyResult_(file, result);
        return null;
    };
    Compiler.prototype.compileAsync = function (file, config, done, method) {
        var _this = this;
        var _a;
        this.currentConfig = config;
        if ((_a = this.handler) === null || _a === void 0 ? void 0 : _a.transformConfig) {
            this.currentConfig = this.handler.transformConfig(file, config, this);
        }
        var fn = this.processAsync_;
        if (fn == null) {
            try {
                var result = this.compile(file, config, method);
                this.applyResult_(file, result);
                setImmediate(function () { return done(); });
            }
            catch (error) {
                setImmediate(function () { return done(error); });
            }
            return;
        }
        this
            .processAsync_(this.getContent_(file), file, this, method)
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
        if (content == null) {
            return null;
        }
        if (typeof content === 'string') {
            return content;
        }
        if (this.textOnly !== true) {
            return content;
        }
        if (content.toString == null || content.toString === Object.prototype.toString) {
            return content;
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
				var _src_ConfigProvider;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var appcfg = require("appcfg");
var atma_utils_1 = require("atma-utils");
var ConfigProvider = /** @class */ (function () {
    function ConfigProvider(name, defaultOptions) {
        this.name = name;
        this.defaultOptions = defaultOptions;
        this.name = name;
    }
    ConfigProvider.prototype.load = function () {
        var defaultOptions = this.defaultOptions;
        var packageOptions = PackageLoader.load(this.name);
        var globalOptions = GlobalLoader.load(this.name);
        var options = {};
        Utils.mergeDeep(options, defaultOptions);
        Utils.mergeDeep(options, packageOptions);
        Utils.mergeDeep(options, globalOptions);
        return options;
    };
    return ConfigProvider;
}());
exports.default = ConfigProvider;
var PackageLoader = /** @class */ (function () {
    function PackageLoader() {
    }
    PackageLoader.load = function (name) {
        var cfg = appcfg.fetch([{ path: 'package.json', optional: true }], { sync: true });
        return Utils.readOptions(cfg, name);
    };
    return PackageLoader;
}());
var GlobalLoader = /** @class */ (function () {
    function GlobalLoader() {
    }
    GlobalLoader.load = function (name) {
        var _a, _b;
        var $global = global;
        var cfg = (_b = (_a = $global.app) === null || _a === void 0 ? void 0 : _a.config) !== null && _b !== void 0 ? _b : $global.config;
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
    function mergeDeep(a, b) {
        for (var key in b) {
            var bVal = b[key];
            if (bVal == null) {
                continue;
            }
            var aVal = a[key];
            if (aVal == null) {
                a[key] = b[key];
                continue;
            }
            if (atma_utils_1.is_rawObject(aVal) && atma_utils_1.is_rawObject(bVal)) {
                mergeDeep(aVal, bVal);
                continue;
            }
            a[key] = bVal;
        }
    }
    Utils.mergeDeep = mergeDeep;
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
				var _src_class_SourceMapFile;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var dependencies_1 = _src_dependencies;
var atma_utils_1 = require("atma-utils");
var SourceMapFile = /** @class */ (function (_super) {
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
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
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
    extMap && Object.keys(extMap).forEach(function (ext) {
        io.File.getFactory().registerHandler(regexp_1.toRegexp(ext), Ctor);
    });
}
exports.register = register;
;
var VirtualFile = /** @class */ (function (_super) {
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
				var _src_utils_path;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function path_combine() {
    var slugs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        slugs[_i] = arguments[_i];
    }
    var out = '';
    for (var i = 0; i < slugs.length; i++) {
        var str = slugs[i];
        if (!str) {
            continue;
        }
        if (out === '') {
            out = str;
            continue;
        }
        out = out.replace(/[\/\\]+$/, '') + '/' + str.replace(/^[\/\\]+/, '');
    }
    return out;
}
exports.path_combine = path_combine;
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_utils_path) && isObject(module.exports)) {
						Object.assign(_src_utils_path, module.exports);
						return;
					}
					_src_utils_path = module.exports;
				}());
				// end:source ./templates/ModuleSimplified.js
				

				// source ./templates/ModuleSimplified.js
				var _src_AtmaServer;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var atma_utils_1 = require("atma-utils");
var dependencies_1 = _src_dependencies;
var path_1 = _src_utils_path;
var AtmaServer = /** @class */ (function () {
    function AtmaServer() {
    }
    AtmaServer.attach = function (app, extMap, middleware, opts) {
        extMap && Object.keys(extMap).forEach(function (ext) {
            var Handler = createHandler(opts);
            if (ext[0] !== '/') {
                var rgx = "(\\." + ext + "($|\\?))";
                var rgx_map = "(\\." + ext + "\\.map($|\\?))";
                app.handlers.registerHandler(rgx, Handler);
                app.handlers.registerHandler(rgx_map, Handler);
                return;
            }
            app.handlers.registerHandler(ext, Handler);
        });
    };
    return AtmaServer;
}());
exports.default = AtmaServer;
function createHandler(options) {
    return /** @class */ (function (_super) {
        __extends(HttpHandler, _super);
        function HttpHandler() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        HttpHandler.prototype.process = function (req, res, config) {
            var handler = this;
            var url = req.url;
            var q = req.url.indexOf('?');
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
            try_createFileInstance_viaStatic(config, url, onSuccess, try_Options);
            function try_Options() {
                try_createFileInstance_byOptions(options, 'static', url, onSuccess, try_Static);
            }
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
                if (isSourceMap && file.readSourceMapAsync) {
                    fn = file.readSourceMapAsync;
                }
                fn
                    .call(file)
                    .then(function () {
                    var source = isSourceMap
                        ? file.sourceMap
                        : file.content;
                    var mimeType = isSourceMap
                        ? 'application/json'
                        : (file.mimeType || options.mimeType);
                    handler.resolve(source, 200, mimeType);
                }, function (err) {
                    handler.reject(err);
                });
            }
        };
        return HttpHandler;
    }(atma_utils_1.class_Dfr));
}
function try_createFileInstance(baseMix, url, onSuccess, onFailure) {
    return __awaiter(this, void 0, void 0, function () {
        function checkSingle(base) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve) {
                            var path = path_1.path_combine(base, url);
                            dependencies_1.io.File
                                .existsAsync(path)
                                .then(function (exists) {
                                if (exists) {
                                    return resolve(new dependencies_1.io.File(path));
                                }
                                resolve(null);
                            }, function () { return resolve(null); });
                        })];
                });
            });
        }
        function checkOuter(str) {
            return __awaiter(this, void 0, void 0, function () {
                var file;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, checkSingle(str)];
                        case 1:
                            file = _a.sent();
                            if (file) {
                                onSuccess(file);
                                return [2 /*return*/, true];
                            }
                            return [2 /*return*/, false];
                    }
                });
            });
        }
        var _i, baseMix_1, base, handled_1, handled;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (baseMix == null) {
                        onFailure();
                        return [2 /*return*/];
                    }
                    if (!Array.isArray(baseMix)) return [3 /*break*/, 5];
                    _i = 0, baseMix_1 = baseMix;
                    _a.label = 1;
                case 1:
                    if (!(_i < baseMix_1.length)) return [3 /*break*/, 4];
                    base = baseMix_1[_i];
                    return [4 /*yield*/, checkOuter(base)];
                case 2:
                    handled_1 = _a.sent();
                    if (handled_1) {
                        return [2 /*return*/];
                    }
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    onFailure();
                    return [2 /*return*/];
                case 5: return [4 /*yield*/, checkOuter(baseMix)];
                case 6:
                    handled = _a.sent();
                    if (handled === false) {
                        onFailure();
                    }
                    return [2 /*return*/];
            }
        });
    });
}
;
function try_createFileInstance_byOptions(options, property, url, onSuccess, onFailure) {
    var base = options && options[property];
    if (base == null) {
        onFailure();
        return;
    }
    try_createFileInstance(base, url, onSuccess, onFailure);
}
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
        var x = void 0;
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
				var _src_CacheProvider;
				(function () {
					var exports = {};
					var module = { exports: exports };
					"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var dependencies_1 = _src_dependencies;
var os = require("os");
var atma_utils_1 = require("atma-utils");
var CacheProvider = /** @class */ (function () {
    function CacheProvider(definition, compiler) {
        this.definition = definition;
        this.compiler = compiler;
        this.TMP = "file://" + os.tmpdir() + "/atma-io/cache";
        this.Items = {};
    }
    CacheProvider.prototype.remove = function (file) {
        var path = this.getPath(file, this.definition, this.compiler);
        dependencies_1.io.File.remove(path);
    };
    CacheProvider.prototype.getSync = function (file) {
        if (this.definition.cacheable !== true) {
            return null;
        }
        var path = this.getPath(file, this.definition, this.compiler);
        var item = this.Items[path];
        if (item == null || item.isBusy()) {
            item = this.Items[path] = new CacheItemSync(path);
        }
        return item;
    };
    CacheProvider.prototype.getAsync = function (file) {
        if (this.definition.cacheable !== true) {
            return null;
        }
        var path = this.getPath(file, this.definition, this.compiler);
        var item = this.Items[path];
        if (item == null) {
            item = this.Items[path] = new CacheItemAsync(path);
        }
        return item;
    };
    CacheProvider.prototype.clearTemp = function () {
        Hashable.clearHashes();
    };
    CacheProvider.prototype.getPath = function (file, definition, compiler) {
        var tmp = this.TMP;
        var filenameHash = Hashable.fromFilename(file);
        var optionsHash = Hashable.fromOptions(definition, compiler);
        var ext = file.uri.extension;
        var name = definition.name;
        var path = tmp + "/" + name + "/" + filenameHash + "/" + optionsHash + "." + ext;
        return path;
    };
    return CacheProvider;
}());
exports.CacheProvider = CacheProvider;
var SOURCE_MAP_SEP = "\n// atma-io-middleware-base sourcemap\n";
var CacheItem = /** @class */ (function (_super) {
    __extends(CacheItem, _super);
    function CacheItem(path) {
        var _this = _super.call(this) || this;
        _this.path = path;
        _this.error = null;
        _this.load();
        return _this;
    }
    CacheItem.prototype.write = function (currentInput, currentOutput, sourceMap) {
        if (currentOutput == null || typeof currentOutput !== 'string' || currentOutput === '') {
            return;
        }
        this.error = null;
        this.inputHash = Hashable.doHash(currentInput);
        this.outputContent = currentOutput;
        this.sourceMap = sourceMap;
        return dependencies_1.io.File.writeAsync(this.path, this.serialize(), { skipHooks: true });
    };
    CacheItem.prototype.isValid = function (content) {
        if (this.error != null) {
            return false;
        }
        var inputCache = Hashable.doHash(content);
        return inputCache === this.inputHash;
    };
    CacheItem.prototype.serialize = function () {
        var str = this.inputHash + "\n" + this.outputContent;
        if (this.sourceMap) {
            var sourceMap = this.sourceMap;
            if (typeof sourceMap !== 'string') {
                sourceMap = JSON.stringify(this.sourceMap);
            }
            str += "" + SOURCE_MAP_SEP + sourceMap;
        }
        return str;
    };
    CacheItem.prototype.deserialize = function (str) {
        var i = str.indexOf('\n');
        var inputHash = str.substring(0, i);
        var content = str.substring(i + 1);
        var sourceMap = null;
        i = content.indexOf(SOURCE_MAP_SEP);
        if (i !== -1) {
            sourceMap = content.substring(i + SOURCE_MAP_SEP.length);
            content = content.substring(0, i);
        }
        return [inputHash, content, sourceMap];
    };
    CacheItem.prototype.onCacheFileLoaded = function (content) {
        var _a = this.deserialize(content), inputHash = _a[0], outputContent = _a[1], sourceMap = _a[2];
        this.inputHash = inputHash;
        this.outputContent = outputContent;
        this.sourceMap = sourceMap;
        this.error = null;
        this.resolve(this);
    };
    CacheItem.prototype.onError = function (error) {
        this.error = error;
        this.resolve(this);
    };
    return CacheItem;
}(atma_utils_1.class_Dfr));
exports.CacheItem = CacheItem;
var CacheItemAsync = /** @class */ (function (_super) {
    __extends(CacheItemAsync, _super);
    function CacheItemAsync() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CacheItemAsync.prototype.load = function () {
        var _this = this;
        var path = this.path;
        dependencies_1.io.File.existsAsync(path).then(function (exists) {
            if (exists === false) {
                _this.resolve(_this);
                return;
            }
            dependencies_1.io.File.readAsync(path, { skipHooks: true }).then(function (content) {
                _this.onCacheFileLoaded(content.toString());
            }, function (error) {
                _this.onError(error);
            });
        }, function (error) {
            _this.onError(error);
        });
    };
    return CacheItemAsync;
}(CacheItem));
var CacheItemSync = /** @class */ (function (_super) {
    __extends(CacheItemSync, _super);
    function CacheItemSync() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CacheItemSync.prototype.load = function () {
        var path = this.path;
        var exists = dependencies_1.io.File.exists(path);
        if (exists === false) {
            this.resolve(this);
            return;
        }
        try {
            var content = dependencies_1.io.File.read(path, { skipHooks: true });
            this.onCacheFileLoaded(content.toString());
        }
        catch (error) {
            this.onError(error);
        }
        ;
    };
    return CacheItemSync;
}(CacheItem));
var Hashable;
(function (Hashable) {
    function fromFilename(file) {
        var path = file.uri.toLocalFile();
        return path.replace(/[^\w\d]/g, '_');
    }
    Hashable.fromFilename = fromFilename;
    var compilerOptsHashes = new Map;
    function fromOptions(definition, compiler) {
        if (compiler.currentConfig == null) {
            // No config for this file, global is used
            var hash_1 = compilerOptsHashes.get(compiler);
            if (hash_1 == null) {
                hash_1 = calcOptsHash(definition, compiler);
                compilerOptsHashes.set(compiler, hash_1);
            }
            return hash_1;
        }
        var hash = calcOptsHash(definition, compiler);
        return hash;
    }
    Hashable.fromOptions = fromOptions;
    function doHash(str) {
        return fnv1aHash(str);
    }
    Hashable.doHash = doHash;
    function clearHashes() {
        compilerOptsHashes.clear();
    }
    Hashable.clearHashes = clearHashes;
    function calcOptsHash(definition, compiler) {
        var opts = definition.defaultOptions;
        if (opts == null) {
            return 'default';
        }
        var str = '';
        for (var key in opts) {
            var val = compiler.getOption(key);
            str += key + ":" + stringify(val);
        }
        return doHash(str);
    }
    function stringify(value) {
        if (value == null) {
            return null;
        }
        switch (typeof value) {
            case 'string':
            case 'number':
            case 'boolean':
                return value;
        }
        if (Array.isArray(value)) {
            return value.map(function (x) { return stringify(x); }).join(',');
        }
        if (value.toString != null && value.toString !== Object.prototype.toString) {
            return value.toString();
        }
        var out = '';
        for (var key in value) {
            out += "" + key + stringify(value[key]);
        }
        return out;
    }
    // ChatGPT FNV-1a Hash implementation
    function fnv1aHash(string) {
        var FNV_PRIME = 0x100000001b3;
        var hash = 0xcbf29ce484222325;
        for (var i = 0; i < string.length; i++) {
            hash ^= string.charCodeAt(i);
            hash *= FNV_PRIME;
        }
        return Math.abs(hash).toString(16);
    }
})(Hashable || (Hashable = {}));
;
				
					function isObject(x) {
						return x != null && typeof x === 'object' && x.constructor === Object;
					}
					if (isObject(_src_CacheProvider) && isObject(module.exports)) {
						Object.assign(_src_CacheProvider, module.exports);
						return;
					}
					_src_CacheProvider = module.exports;
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
var CacheProvider_1 = _src_CacheProvider;
var _currentIo = null;
var Middleware = /** @class */ (function () {
    function Middleware(middlewareDefinition, options, compiler) {
        this.middlewareDefinition = middlewareDefinition;
        this.options = options;
        this.compiler = compiler;
        var name = middlewareDefinition.name;
        this.options = atma_utils_1.obj_extendMany({}, middlewareDefinition.defaultOptions, options);
        this.utils = middlewareDefinition.utils;
        this.name = name;
        this.cache = new CacheProvider_1.CacheProvider(middlewareDefinition, compiler);
    }
    Middleware.prototype.process = function (file, config, method) {
        var inputContent = file.content;
        var item = this.cache.getSync(file);
        if (item != null && item.isValid(inputContent)) {
            file.content = item.outputContent;
            file.sourceMap = item.sourceMap;
            return;
        }
        this.compiler.compile(file, config, method);
        if (item != null) {
            item.write(inputContent, file.content, file.sourceMap);
        }
    };
    Middleware.prototype.processAsync = function (file, config, done, method) {
        this.compiler.setConfig(config);
        var item = this.cache.getAsync(file);
        if (item == null) {
            this.compiler.compileAsync(file, config, done, method);
            return;
        }
        var inputContent = file.content;
        var compiler = this.compiler;
        function onCacheItemLoaded() {
            if (item.isValid(inputContent)) {
                file.content = item.outputContent;
                file.sourceMap = item.sourceMap;
                done();
                return;
            }
            compiler.compileAsync(file, config, onHookCompleted, method);
        }
        function onHookCompleted(error) {
            if (error == null) {
                item.write(inputContent, file.content, file.sourceMap);
            }
            done(error);
        }
        item.then(onCacheItemLoaded, onCacheItemLoaded);
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
        if (this.middlewareDefinition.isVirtualHandler) {
            VirtualFile_1.register(io_, extensionsMap, this.middlewareDefinition);
        }
        this.compiler.onMount(_currentIo);
        this.cache.clearTemp();
    };
    Middleware.prototype.clearTemp = function () {
        this.cache.clearTemp();
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
        if (appcfg.actions && this.middlewareDefinition.action) {
            appcfg.actions[this.name] = this.middlewareDefinition.action;
        }
    };
    /** IO **/
    Middleware.prototype.read = function (file, config) {
        this.process(file, config, 'read');
    };
    Middleware.prototype.readAsync = function (file, config, done) {
        this.processAsync(file, config, done, 'read');
    };
    Middleware.prototype.write = function (file, config) {
        this.process(file, config, 'write');
    };
    Middleware.prototype.writeAsync = function (file, config, done) {
        this.processAsync(file, config, done, 'write');
    };
    Middleware.prototype.setOptions = function (opts) {
        this.options = atma_utils_1.obj_extendMany({}, this.middlewareDefinition.defaultOptions, opts);
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
 *     name: string
 *  process (content, path, options, ctx: { file, method })
 *  processAsync (content, path, options, ctx: { file, method }, done)
 *     defaultOptions: {}
 *  textOnly: true "Should serialize content if some previous middleware parsed it to some struct"
 * }
 */
function create(middlewareDefinition, IO) {
    var name = middlewareDefinition.name, process = middlewareDefinition.process, processAsync = middlewareDefinition.processAsync;
    if (atma_utils_1.is_String(name) === false) {
        throw Error('Middleware is not valid. Name is undefined');
    }
    if (atma_utils_1.is_Function(process) === false && atma_utils_1.is_Function(processAsync) === false) {
        throw Error('Middleware is not valid. At least `process` or `processAsync` methods are expected');
    }
    var config = new ConfigProvider_1.default(name, middlewareDefinition.defaultOptions);
    var options = config.load();
    if (options == null) {
        throw Error("Options for the " + name + " middleware are not resolved.");
    }
    var compiler = new Compiler_1.default(middlewareDefinition, options);
    var middleware = new Middleware_1.default(middlewareDefinition, options, compiler);
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
var Compiler_1 = _src_Compiler;
exports.Compiler = Compiler_1.default;
var create_1 = _src_create;
exports.create = create_1.default;
var dependencies_1 = _src_dependencies;
exports.io = dependencies_1.io;

				
				}());
				// end:source ./templates/RootModule.js
				