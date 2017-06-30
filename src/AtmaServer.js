import { utils } from './package-private.js';

export default class AtmaServer {
    static attach (app, extensions, middleware, options) {
        
    }
}


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
        
        options.base = config.base;
        
        try_createFile_viaStatic(config, url, onSuccess, try_Static);
        
        function try_Static(){
            try_createFile_byConfig(config, 'static', url, onSuccess, try_Base);
        }
        function try_Base() {
            try_createFile_byConfig(config, 'base', url, onSuccess, try_Cwd);
        }
        function try_Cwd() {
            try_createFile(process.cwd(), url, onSuccess, onFailure);
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