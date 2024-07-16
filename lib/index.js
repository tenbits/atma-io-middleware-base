
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils = __importStar(require("atma-utils"));
exports.utils = utils;
const io = __importStar(require("atma-io"));
let globalIo = global.io;
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
Object.defineProperty(exports, "__esModule", { value: true });
const dependencies_1 = _src_dependencies;
function createLogger(options = { type: 'std' }) {
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
class ILogger {
    constructor(options) {
        this.options = options;
    }
    start() {
        if (this.options.interceptStd) {
            Interceptor.hook(this);
        }
    }
    end() {
        if (this.options.interceptStd) {
            Interceptor.unhook();
        }
    }
    delegateEnd(onComplete) {
        if (onComplete == null) {
            return null;
        }
        return (error, ...args) => {
            if (error != null) {
                this.write(error.message);
            }
            this.end();
            onComplete.apply(null, [error, ...args]);
        };
    }
    log(...args) {
        let message = args.join(' ');
        this.write(message, 'info');
    }
    warn(...args) {
        let message = args.join(' ');
        this.write(message, 'warn');
    }
    error(...args) {
        let message = args.join(' ');
        this.write(message, 'error');
    }
}
exports.ILogger = ILogger;
;
class StdLogger extends ILogger {
    write(x) {
        console.log(x);
    }
}
exports.StdLogger = StdLogger;
class SilentLogger extends ILogger {
    constructor(opts) {
        super(opts);
        this.options.interceptStd = true;
    }
    write(x) {
    }
}
exports.SilentLogger = SilentLogger;
;
class FileLogger extends SilentLogger {
    constructor() {
        super(...arguments);
        this.buffer = [];
    }
    lock() {
    }
    release() {
        dependencies_1.io.File.write(this.options.file, this.buffer.join('\n'));
    }
    write(str) {
        this.buffer.push(str);
    }
}
;
class CustomLogger extends SilentLogger {
    constructor(opts) {
        super(opts);
        if (typeof this.options.write !== 'function') {
            throw Error('Custom logger should export the `write` method');
        }
    }
    write(x) {
        this.options.write(x);
    }
}
let Interceptor;
(function () {
    let _process = global.process;
    let _stdOutWrite = _process.stdout.write;
    let _stdErrWrite = _process.stderr.write;
    let _currentListener = null;
    Interceptor = {
        hook(listener) {
            _currentListener = listener;
            setMethods(onStdOut, onStdErr);
        },
        unhook() {
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
const Logger_1 = _src_class_Logger;
const dependencies_1 = _src_dependencies;
const atma_utils_1 = require("atma-utils");
class Compiler {
    constructor(middlewareDefinition, options) {
        this.middlewareDefinition = middlewareDefinition;
        this.options = options;
        /** Single temp Configuration: will be passt on each io File read/write calls */
        this.currentConfig = null;
        this.io = dependencies_1.io;
        const { name, process, processAsync, textOnly = true } = middlewareDefinition;
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
    setConfig(config) {
        this.currentConfig = config;
        return this;
    }
    setOptions(opts) {
        this.logger = Logger_1.createLogger(opts.logger || this.options.logger || this.middlewareDefinition.defaultOptions.logger);
        this.options = opts;
        this.currentConfig = null;
    }
    getOption(property) {
        let config = this.getCurrentConfig();
        if (config != null) {
            let x = atma_utils_1.obj_getProperty(config, property);
            if (x != null) {
                return x;
            }
        }
        return atma_utils_1.obj_getProperty(this.options, property);
    }
    getCurrentConfig() {
        var _a, _b;
        if (this.currentConfig == null) {
            return null;
        }
        return (_b = (_a = atma_utils_1.obj_getProperty(this.currentConfig, `settings.${this.name}`)) !== null && _a !== void 0 ? _a : atma_utils_1.obj_getProperty(this.currentConfig, `${this.name}`)) !== null && _b !== void 0 ? _b : this.currentConfig;
    }
    onMount(io) {
        var _a, _b;
        this.io = io;
        (_b = (_a = this.middlewareDefinition).onMount) === null || _b === void 0 ? void 0 : _b.call(_a, io);
    }
    compile(file, config, method) {
        var _a;
        this.currentConfig = config;
        if ((_a = this.handler) === null || _a === void 0 ? void 0 : _a.transformConfig) {
            this.currentConfig = this.handler.transformConfig(file, config, this);
        }
        let result = this.process_(this.getContent_(file), file, this, method);
        this.applyResult_(file, result);
        return null;
    }
    compileAsync(file, config, done, method) {
        var _a;
        this.currentConfig = config;
        if ((_a = this.handler) === null || _a === void 0 ? void 0 : _a.transformConfig) {
            this.currentConfig = this.handler.transformConfig(file, config, this);
        }
        let fn = this.processAsync_;
        if (fn == null) {
            try {
                let result = this.compile(file, config, method);
                this.applyResult_(file, result);
                setImmediate(() => done());
            }
            catch (error) {
                setImmediate(() => done(error));
            }
            return;
        }
        this
            .processAsync_(this.getContent_(file), file, this, method)
            .then(result => {
            this.applyResult_(file, result);
            done();
        }, error => done(error));
    }
    applyResult_(file, result) {
        if (result == null) {
            return;
        }
        if (typeof result === 'string') {
            file.content = result;
            return;
        }
        file.sourceMap = result.sourceMap;
        file.content = result.content;
    }
    getContent_(file) {
        let content = file.content;
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
    }
}
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appcfg_1 = __importDefault(require("appcfg"));
const atma_utils_1 = require("atma-utils");
class ConfigProvider {
    constructor(name, defaultOptions) {
        this.name = name;
        this.defaultOptions = defaultOptions;
        this.name = name;
    }
    load() {
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
exports.default = ConfigProvider;
class PackageLoader {
    static load(name) {
        let cfg = appcfg_1.default.fetch([{ path: 'package.json', optional: true }], { sync: true });
        return Utils.readOptions(cfg, name);
    }
}
class GlobalLoader {
    static load(name) {
        var _a, _b;
        let $global = global;
        let cfg = (_b = (_a = $global.app) === null || _a === void 0 ? void 0 : _a.config) !== null && _b !== void 0 ? _b : $global.config;
        return Utils.readOptions(cfg, name);
    }
}
var Utils;
(function (Utils) {
    function readOptions(cfg, name) {
        if (cfg == null) {
            return null;
        }
        if (cfg.$get) {
            return cfg.$get(`${name}`)
                || cfg.$get(`settings.${name}`)
                || cfg.$get(`atma.settings.${name}`);
        }
        return (cfg[name])
            || (cfg.settings && cfg.settings[this.name])
            || (cfg.atma && cfg.atma.settings && cfg.atma.settings[this.name]);
    }
    Utils.readOptions = readOptions;
    ;
    function mergeDeep(a, b) {
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
Object.defineProperty(exports, "__esModule", { value: true });
const dependencies_1 = _src_dependencies;
const atma_utils_1 = require("atma-utils");
class SourceMapFile extends dependencies_1.io.File {
    read(opts) {
        if (this.exists('mapOnly'))
            return super.read(opts);
        var path = this.getSourcePath();
        if (path == null)
            return null;
        var file = new dependencies_1.io.File(path);
        file.read(opts);
        return (this.content = file.sourceMap);
    }
    readAsync(opts) {
        if (this.exists('mapOnly'))
            return super.readAsync(opts);
        var path = this.getSourcePath();
        if (path == null) {
            return new atma_utils_1.class_Dfr().reject({
                code: 404,
                filename: this.uri.toLocalFile(),
                message: 'Path equals original'
            });
        }
        let file = new dependencies_1.io.File(path);
        let prom = file.readAsync(opts);
        return prom.then(() => {
            return (this.content = file.sourceMap);
        });
    }
    exists(check) {
        if (super.exists())
            return true;
        if (check === 'mapOnly')
            return false;
        var path = this.getSourcePath();
        return path != null
            ? dependencies_1.io.File.exists(path)
            : false;
    }
    getSourcePath() {
        var path = this.uri.toString(), source = path.replace(/\.map$/i, '');
        return path === source
            ? null
            : source;
    }
}
exports.SourceMapFile = SourceMapFile;
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
    var rgx = `\\.${misc}($|\\?|#)`;
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
Object.defineProperty(exports, "__esModule", { value: true });
const dependencies_1 = _src_dependencies;
const atma_utils_1 = require("atma-utils");
const regexp_1 = _src_utils_regexp;
function register(io, extMap, middlewareDefinition) {
    let Ctor = atma_utils_1.class_create(VirtualFile, middlewareDefinition.VirtualFile);
    extMap && Object.keys(extMap).forEach(ext => {
        io.File.getFactory().registerHandler(regexp_1.toRegexp(ext), Ctor);
    });
}
exports.register = register;
;
class VirtualFile extends dependencies_1.io.File {
    exists() {
        return true;
    }
    existsAsync() {
        return atma_utils_1.class_Dfr.resolve(true);
    }
    read(opts) {
        this.content = '';
        dependencies_1.io.File.processHooks('read', this, opts, null);
        return this.content;
    }
    readAsync(opts) {
        this.content = '';
        const dfr = new atma_utils_1.class_Dfr();
        dependencies_1.io.File.processHooks('read', this, opts, (error) => {
            if (error) {
                dfr.reject(error);
                return;
            }
            dfr.resolve(this.content);
        });
        return dfr;
    }
    write(content, opts) {
        throw new Error('Middleware implements no write-logic');
    }
    writeAsync(content, opts) {
        throw new Error('Middleware implements no write-logic');
    }
    copyTo(path) {
        this.read(null);
        this.write(this.content, path);
        return this;
    }
    copyAsync(path) {
        return this
            .readAsync(null)
            .then(() => {
            return this.writeAsync(this.content, path);
        });
    }
}
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
function path_combine(...slugs) {
    let out = '';
    for (let i = 0; i < slugs.length; i++) {
        let str = slugs[i];
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const atma_utils_1 = require("atma-utils");
const dependencies_1 = _src_dependencies;
const path_1 = _src_utils_path;
class AtmaServer {
    static attach(app, extMap, middleware, opts) {
        extMap && Object.keys(extMap).forEach(ext => {
            let Handler = createHandler(opts);
            if (ext[0] !== '/') {
                let rgx = `(\\.${ext}($|\\?))`;
                let rgx_map = `(\\.${ext}\\.map($|\\?))`;
                app.handlers.registerHandler(rgx, Handler);
                app.handlers.registerHandler(rgx_map, Handler);
                return;
            }
            app.handlers.registerHandler(ext, Handler);
        });
    }
}
exports.default = AtmaServer;
function createHandler(options) {
    return class HttpHandler extends atma_utils_1.class_Dfr {
        process(req, res, config) {
            let handler = this;
            let url = req.url;
            let q = req.url.indexOf('?');
            if (q !== -1) {
                url = url.substring(0, q);
            }
            let isSourceMap = url.substr(-4) === '.map';
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
                let fn = file.readAsync;
                if (isSourceMap && file.readSourceMapAsync) {
                    fn = file.readSourceMapAsync;
                }
                fn
                    .call(file)
                    .then(() => {
                    let source = isSourceMap
                        ? file.sourceMap
                        : file.content;
                    let mimeType = isSourceMap
                        ? 'application/json'
                        : (file.mimeType || options.mimeType);
                    handler.resolve(source, 200, mimeType);
                }, (err) => {
                    handler.reject(err);
                });
            }
        }
    };
}
function try_createFileInstance(baseMix, url, onSuccess, onFailure) {
    return __awaiter(this, void 0, void 0, function* () {
        function checkSingle(base) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve) => {
                    const path = path_1.path_combine(base, url);
                    dependencies_1.io.File
                        .existsAsync(path)
                        .then(function (exists) {
                        if (exists) {
                            return resolve(new dependencies_1.io.File(path));
                        }
                        resolve(null);
                    }, () => resolve(null));
                });
            });
        }
        function checkOuter(str) {
            return __awaiter(this, void 0, void 0, function* () {
                let file = yield checkSingle(str);
                if (file) {
                    onSuccess(file);
                    return true;
                }
                return false;
            });
        }
        if (baseMix == null) {
            onFailure();
            return;
        }
        if (Array.isArray(baseMix)) {
            for (let base of baseMix) {
                let handled = yield checkOuter(base);
                if (handled) {
                    return;
                }
            }
            onFailure();
            return;
        }
        let handled = yield checkOuter(baseMix);
        if (handled === false) {
            onFailure();
        }
    });
}
;
function try_createFileInstance_byOptions(options, property, url, onSuccess, onFailure) {
    let base = options && options[property];
    if (base == null) {
        onFailure();
        return;
    }
    try_createFileInstance(base, url, onSuccess, onFailure);
}
function try_createFileInstance_byConfig(config, property, url, onSuccess, onFailure) {
    let base = config && config[property];
    if (base == null) {
        onFailure();
        return;
    }
    try_createFileInstance(base, url, onSuccess, onFailure);
}
function try_createFileInstance_viaStatic(config, url, onSuccess, onFailure) {
    if (_resolveStaticPath === void 0) {
        let x;
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
    let file = new dependencies_1.io.File(_resolveStaticPath(url, config));
    if (file.exists() === false) {
        onFailure();
        return;
    }
    onSuccess(file);
}
let _resolveStaticPath;
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dependencies_1 = _src_dependencies;
const os = __importStar(require("os"));
const atma_utils_1 = require("atma-utils");
class CacheProvider {
    constructor(definition, compiler) {
        this.definition = definition;
        this.compiler = compiler;
        this.TMP = `file://${os.tmpdir()}/atma-io/cache`;
        this.Items = {};
    }
    remove(file) {
        let path = this.getPath(file, this.definition, this.compiler);
        dependencies_1.io.File.remove(path);
    }
    getSync(file) {
        if (this.definition.cacheable !== true) {
            return null;
        }
        let path = this.getPath(file, this.definition, this.compiler);
        let item = this.Items[path];
        if (item == null || item.isBusy()) {
            item = this.Items[path] = new CacheItemSync(path);
        }
        return item;
    }
    getAsync(file) {
        if (this.definition.cacheable !== true) {
            return null;
        }
        let path = this.getPath(file, this.definition, this.compiler);
        let item = this.Items[path];
        if (item == null) {
            item = this.Items[path] = new CacheItemAsync(path);
        }
        return item;
    }
    clearTemp() {
        Hashable.clearHashes();
    }
    getPath(file, definition, compiler) {
        let tmp = this.TMP;
        let filenameHash = Hashable.fromFilename(file);
        let optionsHash = Hashable.fromOptions(definition, compiler);
        let ext = file.uri.extension;
        let name = definition.name;
        let path = `${tmp}/${name}/${filenameHash}/${optionsHash}.${ext}`;
        return path;
    }
}
exports.CacheProvider = CacheProvider;
const SOURCE_MAP_SEP = `\n// atma-io-middleware-base sourcemap\n`;
class CacheItem extends atma_utils_1.class_Dfr {
    constructor(path) {
        super();
        this.path = path;
        this.error = null;
        this.load();
    }
    write(currentInput, currentOutput, sourceMap) {
        if (currentOutput == null || typeof currentOutput !== 'string' || currentOutput === '') {
            return;
        }
        this.error = null;
        this.inputHash = Hashable.doHash(currentInput);
        this.outputContent = currentOutput;
        this.sourceMap = sourceMap;
        return dependencies_1.io.File.writeAsync(this.path, this.serialize(), { skipHooks: true });
    }
    isValid(content) {
        if (this.error != null) {
            return false;
        }
        const inputCache = Hashable.doHash(content);
        return inputCache === this.inputHash;
    }
    serialize() {
        let str = `${this.inputHash}\n${this.outputContent}`;
        if (this.sourceMap) {
            let sourceMap = this.sourceMap;
            if (typeof sourceMap !== 'string') {
                sourceMap = JSON.stringify(this.sourceMap);
            }
            str += `${SOURCE_MAP_SEP}${sourceMap}`;
        }
        return str;
    }
    deserialize(str) {
        let i = str.indexOf('\n');
        let inputHash = str.substring(0, i);
        let content = str.substring(i + 1);
        let sourceMap = null;
        i = content.indexOf(SOURCE_MAP_SEP);
        if (i !== -1) {
            sourceMap = content.substring(i + SOURCE_MAP_SEP.length);
            content = content.substring(0, i);
        }
        return [inputHash, content, sourceMap];
    }
    onCacheFileLoaded(content) {
        let [inputHash, outputContent, sourceMap] = this.deserialize(content);
        this.inputHash = inputHash;
        this.outputContent = outputContent;
        this.sourceMap = sourceMap;
        this.error = null;
        this.resolve(this);
    }
    onError(error) {
        this.error = error;
        this.resolve(this);
    }
}
exports.CacheItem = CacheItem;
class CacheItemAsync extends CacheItem {
    load() {
        let path = this.path;
        dependencies_1.io.File.existsAsync(path).then(exists => {
            if (exists === false) {
                this.resolve(this);
                return;
            }
            dependencies_1.io.File.readAsync(path, { skipHooks: true }).then(content => {
                this.onCacheFileLoaded(content.toString());
            }, error => {
                this.onError(error);
            });
        }, error => {
            this.onError(error);
        });
    }
}
class CacheItemSync extends CacheItem {
    load() {
        let path = this.path;
        let exists = dependencies_1.io.File.exists(path);
        if (exists === false) {
            this.resolve(this);
            return;
        }
        try {
            let content = dependencies_1.io.File.read(path, { skipHooks: true });
            this.onCacheFileLoaded(content.toString());
        }
        catch (error) {
            this.onError(error);
        }
        ;
    }
}
var Hashable;
(function (Hashable) {
    function fromFilename(file) {
        let path = file.uri.toLocalFile();
        return path.replace(/[^\w\d]/g, '_');
    }
    Hashable.fromFilename = fromFilename;
    const compilerOptsHashes = new Map;
    function fromOptions(definition, compiler) {
        if (compiler.currentConfig == null) {
            // No config for this file, global is used
            let hash = compilerOptsHashes.get(compiler);
            if (hash == null) {
                hash = calcOptsHash(definition, compiler);
                compilerOptsHashes.set(compiler, hash);
            }
            return hash;
        }
        let hash = calcOptsHash(definition, compiler);
        return hash;
    }
    Hashable.fromOptions = fromOptions;
    function doHash(str) {
        return simpleHash(str);
    }
    Hashable.doHash = doHash;
    function clearHashes() {
        compilerOptsHashes.clear();
    }
    Hashable.clearHashes = clearHashes;
    function calcOptsHash(definition, compiler) {
        let opts = definition.defaultOptions;
        if (opts == null) {
            return 'default';
        }
        let str = '';
        for (let key in opts) {
            let val = compiler.getOption(key);
            str += `${key}:${stringify(val)}`;
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
            return value.map(x => stringify(x)).join(',');
        }
        if (value.toString != null && value.toString !== Object.prototype.toString) {
            return value.toString();
        }
        let out = '';
        for (let key in value) {
            out += `${key}${stringify(value[key])}`;
        }
        return out;
    }
    function simpleHash(str) {
        let hash = 0;
        const prime = 31;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash * prime + char) | 0; // Bitwise OR to ensure hash is a 32-bit integer
        }
        return Math.abs(hash).toString(16);
    }
})(Hashable = exports.Hashable || (exports.Hashable = {}));
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SourceMapFile_1 = _src_class_SourceMapFile;
const VirtualFile_1 = _src_class_VirtualFile;
const AtmaServer_1 = __importDefault(_src_AtmaServer);
const atma_utils_1 = require("atma-utils");
const ConfigProvider_1 = _src_ConfigProvider;
const CacheProvider_1 = _src_CacheProvider;
let _currentIo = null;
class Middleware {
    constructor(middlewareDefinition, options, compiler) {
        this.middlewareDefinition = middlewareDefinition;
        this.options = options;
        this.compiler = compiler;
        let { name } = middlewareDefinition;
        this.options = atma_utils_1.obj_extendMany({}, middlewareDefinition.defaultOptions, options);
        this.utils = middlewareDefinition.utils;
        this.name = name;
        this.cache = new CacheProvider_1.CacheProvider(middlewareDefinition, compiler);
    }
    process(file, config, method) {
        let inputContent = file.content;
        let item = this.cache.getSync(file);
        if (item != null && item.isValid(inputContent)) {
            file.content = item.outputContent;
            file.sourceMap = item.sourceMap;
            return;
        }
        this.compiler.compile(file, config, method);
        if (item != null) {
            item.write(inputContent, file.content, file.sourceMap);
        }
    }
    processAsync(file, config, done, method) {
        this.compiler.setConfig(config);
        let item = this.cache.getAsync(file);
        if (item == null) {
            this.compiler.compileAsync(file, config, done, method);
            return;
        }
        let inputContent = file.content;
        let compiler = this.compiler;
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
    }
    init(io_, extraOptions) {
        _currentIo = io_;
        io_.File.middleware[this.name] = this;
        let opts = this.options;
        if (extraOptions) {
            this.setOptions(extraOptions);
        }
        let { extensions, sourceMap } = opts;
        let extensionsMap = normalizeExtensions(extensions, this.name);
        registerExtensions(io_.File, extensionsMap, sourceMap);
        if (this.middlewareDefinition.isVirtualHandler) {
            VirtualFile_1.register(io_, extensionsMap, this.middlewareDefinition);
        }
        this.compiler.onMount(_currentIo);
        this.cache.clearTemp();
    }
    clearTemp() {
        this.cache.clearTemp();
    }
    /** Atma-Server */
    attach(app) {
        let globalOpts = atma_utils_1.obj_extend({}, this.options);
        let appOptions = app.config && (app.config.$get(`settings.${this.name}`) || app.config.$get(`${this.name}`));
        if (appOptions) {
            globalOpts = atma_utils_1.obj_extend(globalOpts, appOptions);
        }
        let extensions = globalOpts.extensions;
        if (extensions) {
            extensions = normalizeExtensions(extensions, this.name);
        }
        AtmaServer_1.default.attach(app, extensions, this, globalOpts);
    }
    /** Atma.Plugin */
    register(appcfg) {
        let extraOptions = ConfigProvider_1.Utils.readOptions(appcfg, this.name);
        if (extraOptions == null) {
            return;
        }
        this.setOptions(extraOptions);
        let { extensions, sourceMap } = extraOptions;
        if (extensions) {
            let extensionsMap = normalizeExtensions(extensions, this.name);
            if (_currentIo) {
                registerExtensions(_currentIo.File, extensionsMap, sourceMap);
            }
        }
        if (appcfg.actions && this.middlewareDefinition.action) {
            appcfg.actions[this.name] = this.middlewareDefinition.action;
        }
    }
    /** IO **/
    read(file, config) {
        this.process(file, config, 'read');
    }
    readAsync(file, config, done) {
        this.processAsync(file, config, done, 'read');
    }
    write(file, config) {
        this.process(file, config, 'write');
    }
    writeAsync(file, config, done) {
        this.processAsync(file, config, done, 'write');
    }
    setOptions(opts) {
        this.options = atma_utils_1.obj_extendMany({}, this.middlewareDefinition.defaultOptions, opts);
        this.compiler.setOptions(this.options);
    }
}
exports.default = Middleware;
;
/**
 * Prepair Extensions Map Object for the io.File.registerExtensions
 * @param {Array|Object} mix
 * @return {Object} Example: { fooExt: ['current-midd-name:read'] }
 */
function normalizeExtensions(mix, name) {
    let map = {};
    if (mix == null) {
        return map;
    }
    if (Array.isArray(mix)) {
        mix.forEach(ext => map[ext] = [`${name}:read`]);
        return map;
    }
    for (let ext in mix) {
        let str = mix[ext] || 'read', types;
        if (str.indexOf(',') > -1) {
            types = str.trim().split(',').map(x => x.trim());
        }
        else {
            types = [str.trim()];
        }
        map[ext] = [];
        types.forEach(type => map[ext].push(`${name}:${type}`));
    }
    return map;
}
function registerExtensions(File, extMap, withSourceMap = false) {
    File.registerExtensions(extMap);
    if (withSourceMap) {
        for (let ext in extMap) {
            File.getFactory().registerHandler(new RegExp('\\.' + ext + '.map$', 'i'), SourceMapFile_1.SourceMapFile);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const atma_utils_1 = require("atma-utils");
const dependencies_1 = _src_dependencies;
const ConfigProvider_1 = __importDefault(_src_ConfigProvider);
const Compiler_1 = __importDefault(_src_Compiler);
const Middleware_1 = __importDefault(_src_class_Middleware);
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
    let { name, process, processAsync } = middlewareDefinition;
    if (atma_utils_1.is_String(name) === false) {
        throw Error('Middleware is not valid. Name is undefined');
    }
    if (atma_utils_1.is_Function(process) === false && atma_utils_1.is_Function(processAsync) === false) {
        throw Error('Middleware is not valid. At least `process` or `processAsync` methods are expected');
    }
    let config = new ConfigProvider_1.default(name, middlewareDefinition.defaultOptions);
    let options = config.load();
    if (options == null) {
        throw Error(`Options for the ${name} middleware are not resolved.`);
    }
    let compiler = new Compiler_1.default(middlewareDefinition, options);
    let middleware = new Middleware_1.default(middlewareDefinition, options, compiler);
    let ioLib = IO || dependencies_1.io;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Compiler_1 = __importDefault(_src_Compiler);
exports.Compiler = Compiler_1.default;
const create_1 = __importDefault(_src_create);
exports.create = create_1.default;
const dependencies_1 = _src_dependencies;
exports.io = dependencies_1.io;

				
				}());
				// end:source ./templates/RootModule.js
				