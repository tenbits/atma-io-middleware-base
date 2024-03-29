import { class_Dfr } from 'atma-utils'
import { io } from './dependencies'
import Middleware from './class/Middleware'
import { IOptions } from './IConfig'
import { path_combine } from './utils/path'
import { IncomingMessage, ServerResponse } from 'http'

export default class AtmaServer {
    static attach (app, extMap, middleware: Middleware, opts: IOptions) {
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

function createHandler (options) {

    return class HttpHandler extends class_Dfr {
        process (req: IncomingMessage, res: ServerResponse, config) {
            let handler = this;
            let url = req.url;
            let q = req.url.indexOf('?');
            if (q !== -1) {
                url = url.substring(0, q);
            }
            let isSourceMap = url.substr(-4) === '.map';
            if (isSourceMap)  {
                url = url.substring(0, url.length - 4);
            }
            if (url[0] === '/') {
                url = url.substring(1);
            }
            if (config.base) {
                options.base = config.base;
            }

            try_createFileInstance_viaStatic(config, url, onSuccess, try_Options);

            function try_Options(){
                try_createFileInstance_byOptions(options, 'static', url, onSuccess, try_Static);
            }
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
                (handler as any).reject('Not Found - ' + url, 404, 'text/plain');
            }
            function onSuccess(file){
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
                            : (file.mimeType || options.mimeType)
                            ;

                        handler.resolve(source, 200, mimeType);
                    }, (err) => {
                        handler.reject(err);
                    });
            }
        }
    }
}




async function try_createFileInstance(baseMix: string | string[], url, onSuccess, onFailure) {
    async function checkSingle (base) {
        return new Promise((resolve) => {
            const path = path_combine(base, url);
            io.File
                .existsAsync(path)
                .then(function(exists){
                    if (exists) {
                        return resolve(new io.File(path));
                    }
                    resolve(null);
                }, () => resolve(null));
        });
    }
    async function checkOuter (str: string) {
        let file = await checkSingle(str);
        if (file) {
            onSuccess(file);
            return true;
        }
        return false;
    }
    if (baseMix == null) {
        onFailure();
        return;
    }

    if (Array.isArray(baseMix)) {
        for (let base of baseMix) {
            let handled = await checkOuter(base)
            if (handled) {
                return;
            }
        }
        onFailure();
        return;
    }
    let handled = await checkOuter(baseMix);
    if (handled === false) {
        onFailure();
    }
};

function try_createFileInstance_byOptions(options, property, url, onSuccess, onFailure){
    let base = options && options[property];
    if (base == null) {
        onFailure();
        return;
    }
    try_createFileInstance(base, url, onSuccess, onFailure);
}
function try_createFileInstance_byConfig(config, property, url, onSuccess, onFailure){
    let base = config && config[property];
    if (base == null) {
        onFailure();
        return;
    }
    try_createFileInstance(base, url, onSuccess, onFailure);
}
function try_createFileInstance_viaStatic(config, url, onSuccess, onFailure){
    if (_resolveStaticPath === void 0) {
        let x;
        _resolveStaticPath = (x = (global as any).atma)
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
    let file = new io.File(_resolveStaticPath(url, config));
    if (file.exists() === false) {
        onFailure();
        return;
    }
    onSuccess(file);
}
let _resolveStaticPath;
