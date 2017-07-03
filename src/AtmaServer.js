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
var _resolveStaticPath;