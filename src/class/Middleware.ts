import { SourceMapFile } from './SourceMapFile';
import { register } from './VirtualFile';
import AtmaServer from '../AtmaServer';
import Compiler from '../Compiler'
import { IMiddlewareDefinition, IOptions } from '../IConfig'
import { obj_extendMany, obj_extend } from 'atma-utils'
import { io } from '../dependencies'
import { Utils } from '../ConfigProvider'
import { CacheProvider } from '../CacheProvider';

declare type File = InstanceType<typeof io.File>

let _currentIo: typeof io = null;

export default class Middleware {
    name: string
    utils: any
    cache: CacheProvider

    constructor(
        public middlewareDefinition: IMiddlewareDefinition,
        public options: IOptions,
        public compiler: Compiler) {
        let { name } = middlewareDefinition;

        this.options = obj_extendMany({}, middlewareDefinition.defaultOptions, options);
        this.utils = middlewareDefinition.utils;
        this.name = name;
        this.cache = new CacheProvider(middlewareDefinition, compiler);
    }
    process(file: File, config: any, method: 'read' | 'write') {
        let inputContent = file.content as string;
        let item = this.cache.getSync(file);
        if (item != null && item.isValid(inputContent)) {
            file.content = item.outputContent;
            file.sourceMap = item.sourceMap;
            return;
        }

        this.compiler.compile(file, config, method);

        if (item != null) {
            item.write(inputContent, file.content as string, file.sourceMap);
        }
    }
    processAsync(file: File, config, done, method: 'read' | 'write') {
        this.compiler.setConfig(config);

        let item = this.cache.getAsync(file);
        if (item == null) {
            this.compiler.compileAsync(file, config, done, method);
            return;
        }
        let inputContent = file.content as string;
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
                item.write(inputContent, file.content as string, file.sourceMap);
            }
            done(error);
        }
        item.then(onCacheItemLoaded, onCacheItemLoaded);
    }
    init(io_: typeof io, extraOptions?) {
        _currentIo = io_;

        io_.File.middleware[this.name] = this;
        let opts = this.options;
        if (extraOptions) {
            this.setOptions(extraOptions)
        }
        let { extensions, sourceMap } = opts;
        let extensionsMap = normalizeExtensions(extensions, this.name);

        registerExtensions(io_.File, extensionsMap, sourceMap);

        if (this.middlewareDefinition.isVirtualHandler) {
            register(io_, extensionsMap, this.middlewareDefinition);
        }
        this.compiler.onMount(_currentIo);
        this.cache.clearTemp();
    }

    clearTemp() {
        this.cache.clearTemp();
    }


    /** Atma-Server */
    attach(app) {
        let globalOpts = obj_extend({}, this.options);
        let appOptions = app.config && (app.config.$get(`settings.${this.name}`) || app.config.$get(`${this.name}`));
        if (appOptions) {
            globalOpts = obj_extend(globalOpts, appOptions);
        }
        let extensions = globalOpts.extensions;
        if (extensions) {
            extensions = normalizeExtensions(extensions, this.name);
        }
        AtmaServer.attach(app, extensions, this, globalOpts);
    }

    /** Atma.Plugin */
    register(appcfg) {
        let extraOptions = Utils.readOptions(appcfg, this.name);
        if (extraOptions == null) {
            return;
        }
        this.setOptions(extraOptions)

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
        this.options = obj_extendMany({}, this.middlewareDefinition.defaultOptions, opts);
        this.compiler.setOptions(this.options);
    }
};

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

function registerExtensions(File, extMap, withSourceMap = false) {
    File.registerExtensions(extMap);

    if (withSourceMap) {
        for (let ext in extMap) {
            File.getFactory().registerHandler(
                new RegExp('\\.' + ext + '.map$', 'i')
                , SourceMapFile
            );
        }
    }
}
