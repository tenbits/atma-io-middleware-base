import { io } from './dependencies'
import { IMiddlewareDefinition } from './IConfig'
import Compiler from './Compiler';

import * as os from 'os';
import { class_Dfr } from 'atma-utils';


declare type File = InstanceType<typeof io.File>

export class CacheProvider {

    private readonly TMP = `file://${os.tmpdir()}/atma-io/cache`;
    private readonly Items: {[key: string]: CacheItem} = {};

    constructor (public definition: IMiddlewareDefinition, public compiler: Compiler) {

    }
    remove (file: File) {
        let path = this.getPath(file, this.definition, this.compiler);
        io.File.remove(path);
    }

    getSync (file: File): CacheItem {
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
    getAsync (file: File): CacheItem {
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

    clearTemp () {
        Hashable.clearHashes();
    }

    private getPath (file: File, definition: IMiddlewareDefinition, compiler: Compiler): string {
        let tmp = this.TMP;
        let filenameHash = Hashable.fromFilename(file);
        let optionsHash = Hashable.fromOptions(definition, compiler);
        let ext = file.uri.extension;
        let name = definition.name;

        let path = `${tmp}/${name}/${filenameHash}/${optionsHash}.${ext}`;

        return path;
    }
}

const SOURCE_MAP_SEP = `\n// atma-io-middleware-base sourcemap\n`;

export abstract class CacheItem  extends class_Dfr {
    public error = null;

    public inputHash: string
    public outputContent: string
    public sourceMap: string

    constructor (public path: string) {
        super();
        this.load();
    }

    abstract load ();

    public write (currentInput: string, currentOutput: string, sourceMap: string) {
        if (currentOutput == null || typeof currentOutput !== 'string' || currentOutput === '') {
            return;
        }
        this.error = null;
        this.inputHash = Hashable.doHash(currentInput);
        this.outputContent = currentOutput;
        this.sourceMap = sourceMap;

        return io.File.writeAsync(this.path, this.serialize(), { skipHooks: true });
    }

    public isValid (content: string): boolean {
        if (this.error != null) {
            return false;
        }
        const  inputCache = Hashable.doHash(content);
        return inputCache === this.inputHash;
    }

    protected serialize () {
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
    protected deserialize (str: string) {
        let i = str.indexOf('\n');
        let inputHash = str.substring(0, i);
        let content = str.substring(i + 1);
        let sourceMap = null;
        i = content.indexOf(SOURCE_MAP_SEP);
        if (i !== -1) {
            sourceMap = content.substring(i + SOURCE_MAP_SEP.length);
            content = content.substring(0, i);
        }

        return [ inputHash, content, sourceMap ]
    }

    protected onCacheFileLoaded (content: string) {
        let [inputHash, outputContent, sourceMap] = this.deserialize(content);

        this.inputHash = inputHash;
        this.outputContent = outputContent;
        this.sourceMap = sourceMap;
        this.error = null;
        this.resolve(this);
    }
    protected onError (error) {
        this.error = error;
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

            io.File.readAsync(path, { skipHooks: true }).then(
                content => {
                   this.onCacheFileLoaded(content.toString());
                },
                error => {
                    this.onError(error);
                }
            );
        }, error => {
            this.onError(error);
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
            let content = io.File.read(path, { skipHooks: true });
            this.onCacheFileLoaded(content.toString());
        } catch (error) {
            this.onError(error);
        };
    }
}


export namespace Hashable {

    export function fromFilename (file: File) {
        let path = file.uri.toLocalFile();

        return path.replace(/[^\w\d]/g, '_');
    }

    const compilerOptsHashes = new Map;

    export function fromOptions (definition: IMiddlewareDefinition, compiler: Compiler) {
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

    export function doHash (str: string) {
        return simpleHash(str);
    }

    export function clearHashes () {
        compilerOptsHashes.clear();
    }

    function calcOptsHash (definition: IMiddlewareDefinition, compiler: Compiler) {
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
    function stringify (value: any): string {
        if (value == null) {
            return null;
        }
        switch (typeof value) {
            case 'string':
            case 'number':
            case 'boolean':
                return value as string;
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

    function simpleHash (str) {
        let hash = 0;
        const prime = 31;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash * prime + char) | 0;  // Bitwise OR to ensure hash is a 32-bit integer
        }
        return Math.abs(hash).toString(16);
    }
}
