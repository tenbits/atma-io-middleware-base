import { io } from '../dependencies';
import { class_create, class_Dfr } from 'atma-utils';
import { toRegexp } from '../utils/regexp';
import { IMiddlewareDefinition } from '../IConfig'


export function register (io, extMap, middlewareDefinition: IMiddlewareDefinition) {
    let Ctor = class_create(VirtualFile, middlewareDefinition.VirtualFile);
    extMap && Object.keys(extMap).forEach(ext => {
        io.File.getFactory().registerHandler(toRegexp(ext), Ctor);
    });
};

class VirtualFile extends io.File {

    exists () {
        return true;
    }
    existsAsync () {
        return class_Dfr.resolve(true) as PromiseLike<boolean>;
    }
	read (opts) {
        this.content = '';
        
        io.File.processHooks('read', this, opts, null);
		return this.content;
	}
	
	readAsync (opts) {
        this.content = '';
        const dfr = new class_Dfr();
        
        io.File.processHooks('read', this, opts, (error) => {
            if (error) {
                dfr.reject(error);
                return;
            }
            dfr.resolve(this.content);
        });
        return dfr as PromiseLike<string>;
	}
    write (content, opts): this {
        throw new Error ('Middleware implements no write-logic'); 
    }
    writeAsync (content, opts): PromiseLike<any> {
        throw new Error ('Middleware implements no write-logic');
    }
    copyTo (path): this {
        this.read(null);
        this.write(this.content, path);
        return this;
    }
    copyAsync (path) {
        return this
            .readAsync(null)
            .then(() => {
                return this.writeAsync(this.content, path);
            });
    }
};