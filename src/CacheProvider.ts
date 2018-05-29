import { io } from './dependencies'
import { IMiddlewareDefinition, IOptions } from './IConfig'
import Compiler from './Compiler';

import * as os from 'os';
import * as hash from 'xxhashjs';
import { class_Dfr } from 'atma-utils';
import { exists } from 'fs';


export class CacheProvider {

    private readonly TMP = `file://${os.tmpdir()}/atma-io/cache`;
    private readonly Items: {[key: string]: CacheItem} = {};

    constructor (public definition: IMiddlewareDefinition, public compiler: Compiler) {

    }
    remove (file: io.File) {
        let path = this.getPath(file, this.definition, this.compiler);
        io.File.remove(path);
    }

    getSync (file: io.File): CacheItem {
        if (this.definition.cacheable !== true) {
            return null;
        }
        let path = this.getPath(file, this.definition, this.compiler);
        let item = this.Items[path];
        if (item == null || item.isBusy()) {
            item = this.Items[path] = new CacheItemSync(path, file.content as string);
        }        
        return item;
    }
    getAsync (file: io.File): CacheItem {
        if (this.definition.cacheable !== true) {
            return null;
        }
        let path = this.getPath(file, this.definition, this.compiler);
        let item = this.Items[path];
        if (item == null) {
            item = this.Items[path] = new CacheItemAsync(path, file.content as string);
        }        
        return item;
    }

    private getPath (file: io.File, definition: IMiddlewareDefinition, compiler: Compiler): string {
        let tmp = this.TMP;
        let filenameHash = Hashable.fromFilename(file);
        let optionsHash = Hashable.fromOptions(definition, compiler);
        let ext = file.uri.extension;
        let name = definition.name;

        let path = `${tmp}/${name}/${filenameHash}/${optionsHash}.${ext}`;

        return path;
    }
}

export abstract class CacheItem  extends class_Dfr {
    public isCached = false
    public error = null;

    public inputHash: string
    public outputContent: string

    constructor (public path: string, public inputContent: string) {
        super();

        this.inputHash = Hashable.doHash(inputContent);
        this.load();            
    }

    abstract load ();

    public write (result: string) {
        if (result == null || typeof result !== 'string' || result === '') {
            return;
        }
        this.outputContent = result;
        this.isCached = true;
        return io.File.writeAsync(this.path, this.serialize());
    }

    protected serialize () {
        return `${this.inputHash}\n${this.outputContent}`;
    }
    protected deserialize (str: string) {
        let i = str.indexOf('\n');
        return [
            str.substring(0, i), 
            str.substring(i + 1)
        ];
    }

    protected onCacheFileLoaded (content: string) {
        let [hash, result] = this.deserialize(content);
        
        if (this.inputHash === hash) {
            this.isCached = true;
            this.outputContent = result;            
        }
        this.resolve(this);
    }
    protected onError (error) {
        this.error = error;
        this.isCached = false;
        this.resolve(this);
    }
}

class CacheItemAsync extends CacheItem {
    public load () {
        let path = this.path;
        io.File.existsAsync(path).then(exists => {
            if (exists === false) {
                this.resolve(this);
                return;
            }

            io.File.readAsync(path).then(
                content => {
                   this.onCacheFileLoaded(content);
                },
                error => {
                    this.onError(error);
                }
            );
        });
    }
}


class CacheItemSync extends CacheItem {
    public load () {
        let path = this.path;
        let exists = io.File.exists(path);
        if (exists === false) {
            this.resolve(this);
            return;
        }
        try {
            let content = io.File.read(path);        
            this.onCacheFileLoaded(content);
        } catch (error) {
            this.onError(error);
        };
    }
}


namespace Hashable {

    export function fromFilename (file: io.File) {
        let path = file.uri.toLocalFile();

        return path.replace(/[^\w\d]/g, '_');
    }

    const compilerOptsHashes = new Map;

    export function fromOptions (definition: IMiddlewareDefinition, compiler: Compiler) {
        if (compilerOptsHashes.has(compiler)) {
            return compilerOptsHashes.get(compiler);
        }
        let hash = calcOptsHash(definition, compiler);        
        compilerOptsHashes.set(compiler, hash);
        return hash;
    }

    export function doHash (str: string) {
        return hash.h32(str, 0xA84800A8).toString(16);
    }

    function calcOptsHash (definition: IMiddlewareDefinition, compiler: Compiler) {
        let opts = definition.defaultOptions;
        if (opts == null) {
            return 'default';
        }
        
        var str = '';
        for (let key in opts) {
            let val = compiler.getOption(key);
            str += `${key}:${stringify(val)}`;
        }

        return doHash(str);
    }
    function stringify (value: any): string {
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
        if (value.toString !== Object.prototype.toString) {
            return value.toString();
        }

        let out = '';
        for (let key in value) {
            out += `${key}${stringify(value[key])}`;
        }
        return out;
    }
}