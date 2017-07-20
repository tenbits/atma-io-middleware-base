import { io } from '../package-private';
import { class_create, class_Dfr } from 'atma-utils';
import { toRegexp } from '../utils/regexp';


export function register (io, extMap, middlewareDefinition) {
    let Ctor = class_create(VirtualFile, middlewareDefinition.VirtualFile);
    Object.keys(extMap).forEach(ext => {
        io.File.getFactory().registerHandler(toRegexp(ext), Ctor);
    });
};

class VirtualFile extends io.File {

    exists () {
        return true;
    }
    existsAsync () {
        return class_Dfr.resolve(true);
    }
	// read (opts) {
    //     this.content = '';
    //     const { File } = io;
    //     File.processHooks('read', <File> this, opts, null);
	// 	return this.content;
	// }
	
	// readAsync (opts){
    //     this.content = '';
    //     const dfr = new class_Dfr<any>();
    //     io.File.processHooks('read', this, opts, (error) => {
    //         if (error) {
    //             dfr.reject(error);
    //             return;
    //         }
    //         dfr.resolve(this.content);
    //     });
    //     return dfr;
	// }
    // write (content, opts) {
    //     throw new Error ('Middleware implements no write-logic');
    //     return this;
    // }
    // writeAsync (content, opts) {
    //     throw new Error ('Middleware implements no write-logic');
    //     return this;
    // }
    // copyTo (path) {
    //     this.read(null);
    //     this.write(this.content, path);
    // }
    // copyAsync (path) {
    //     return this
    //         .readAsync(null)
    //         .then(() => this.writeAsync(this.content, path));
    // }
};