// Generated by dts-bundle v0.7.3
// Dependencies for this module:
//   ../atma-utils

declare module 'atma-io-middleware-base' {
    import Compiler from 'atma-io-middleware-base/Compiler';
    import create from 'atma-io-middleware-base/create';
    import { io } from 'atma-io-middleware-base/dependencies';
    export { create, io, Compiler };
}

declare module 'atma-io-middleware-base/Compiler' {
    import { ILogger } from 'atma-io-middleware-base/class/Logger';
    import { IMiddlewareDefinition, IOptions, IMiddResult, IMiddlewareProcessAsyncFn, IMiddlewareProcessFn } from 'atma-io-middleware-base/IConfig';
    export default class Compiler {
        middlewareDefinition: IMiddlewareDefinition;
        options: IOptions;
        logger: ILogger;
        textOnly: boolean;
        /** Single temp Configuration: will be passt on each io File read/write calls */
        currentConfig: any;
        name: string;
        protected process_: IMiddlewareProcessFn;
        protected processAsync_: IMiddlewareProcessAsyncFn;
        utils?: any;
        constructor(middlewareDefinition: IMiddlewareDefinition, options: IOptions);
        setOptions(opts: IOptions): void;
        getOption(property: any): {};
        onMount(io: any): void;
        compile(file: any, config: any, method: 'read' | 'write'): string | IMiddResult | undefined;
        compileAsync(file: any, config: any, done: any, method: 'read' | 'write'): void;
    }
}

declare module 'atma-io-middleware-base/create' {
    import { io } from 'atma-io-middleware-base/dependencies';
    import { IMiddlewareDefinition } from 'atma-io-middleware-base/IConfig';
    import Middleware from 'atma-io-middleware-base/class/Middleware';
    /**
      * @middlewareDefintion {
      * 	name: string
      *  process (content, path, options, ctx: { file, method })
      *  processAsync (content, path, options, ctx: { file, method }, done)
      * 	defaultOptions: {}
      *  textOnly: true "Should serialize content if some previous middleware parsed it to some struct"
      * }
      */
    export default function create(middlewareDefinition: IMiddlewareDefinition, IO?: typeof io): Middleware;
}

declare module 'atma-io-middleware-base/dependencies' {
    import * as utils from 'atma-utils';
    const io: any;
    export { io, utils };
}

declare module 'atma-io-middleware-base/class/Logger' {
    export function createLogger(options?: LogOptions): SilentLogger | StdLogger;
    export interface LogOptions {
        type: 'silent' | 'file' | 'custom' | 'std';
        interceptStd?: boolean;
        file?: string;
        write?: (x: string) => void;
        [key: string]: any;
    }
    export abstract class ILogger {
        options: LogOptions;
        constructor(options: LogOptions);
        start(): void;
        end(): void;
        delegateEnd(onComplete: Function): Function;
        abstract write(x: string, level?: 'error' | 'warn' | 'info'): any;
        log(...args: any[]): void;
        warn(...args: any[]): void;
        error(...args: any[]): void;
    }
    export class StdLogger extends ILogger {
        write(x: string): void;
    }
    export class SilentLogger extends ILogger {
        constructor(opts: any);
        write(x: string): void;
    }
}

declare module 'atma-io-middleware-base/IConfig' {
    import { io } from 'atma-io-middleware-base/dependencies';
    import Compiler from 'atma-io-middleware-base/Compiler';
    import { LogOptions } from 'atma-io-middleware-base/class/Logger';
    export interface IMiddResult {
        content: string | any;
        sourceMap?: string | any;
    }
    export interface IMiddlewareProcessFn {
        (content: string | any, file?: io.File, compiler?: Compiler, method?: 'read' | 'write'): string | IMiddResult | undefined;
    }
    export interface IMiddlewareProcessAsyncFn {
        (content: string | any, file?: io.File, compiler?: Compiler, method?: 'read' | 'write'): PromiseLike<string | IMiddResult | undefined>;
    }
    export interface IMiddlewareDefinition {
        name: string;
        cacheable?: boolean;
        textOnly?: boolean;
        defaultOptions?: IOptions;
        isVirtualHandler?: boolean;
        VirtualFile?: IVirtualFileDefinition;
        process?: IMiddlewareProcessFn;
        processAsync?: IMiddlewareProcessAsyncFn;
        onMount?: (ioLib: typeof io) => void;
        action?: IAtmaActionDefinition;
        utils?: any;
    }
    export interface IOptions {
        logger?: LogOptions;
        mimeType?: string;
        extensions?: string[] | {
            [ext: string]: string;
        };
        sourceMap?: boolean;
        [key: string]: any;
    }
    export interface IVirtualFileDefinition {
        exists?(): boolean;
        existsAsync?(): PromiseLike<boolean>;
        read?(opts?: any): any;
        readAsync?(opts?: any): PromiseLike<any>;
        write?(content: any, opts?: any): this;
        writeAsync?(content: any, opts?: any): PromiseLike<void>;
        copyTo?(path: string): this;
        copyAsync?(path: string): Promise<void>;
    }
    export interface IAtmaActionDefinition {
        help?: {
            description?: string;
            args?: {
                [key: string]: string;
            };
        };
        process(config: object, done: Function): any | void;
    }
}

declare module 'atma-io-middleware-base/class/Middleware' {
    import Compiler from 'atma-io-middleware-base/Compiler';
    import { IMiddlewareDefinition, IOptions } from 'atma-io-middleware-base/IConfig';
    import { io } from 'atma-io-middleware-base/dependencies';
    import { CacheProvider } from 'atma-io-middleware-base/CacheProvider';
    export default class Middleware {
        middlewareDefinition: IMiddlewareDefinition;
        options: IOptions;
        compiler: Compiler;
        name: string;
        utils: any;
        cache: CacheProvider;
        constructor(middlewareDefinition: IMiddlewareDefinition, options: IOptions, compiler: Compiler);
        process(file: io.File, config: any, method: 'read' | 'write'): void;
        processAsync(file: io.File, config: any, done: any, method: 'read' | 'write'): void;
        init(io_: typeof io, extraOptions?: any): void;
        /** Atma-Server */
        attach(app: any): void;
        /** Atma.Plugin */
        register(appcfg: any): void;
        /** IO **/
        read(file: any, config: any): void;
        readAsync(file: any, config: any, done: any): void;
        write(file: any, config: any): void;
        writeAsync(file: any, config: any, done: any): void;
        setOptions(opts: any): void;
    }
}

declare module 'atma-io-middleware-base/CacheProvider' {
    import { IMiddlewareDefinition } from 'atma-io-middleware-base/IConfig';
    import Compiler from 'atma-io-middleware-base/Compiler';
    import { class_Dfr } from 'atma-utils';
    export class CacheProvider {
        definition: IMiddlewareDefinition;
        compiler: Compiler;
        constructor(definition: IMiddlewareDefinition, compiler: Compiler);
        remove(file: io.File): void;
        getSync(file: io.File): CacheItem;
        getAsync(file: io.File): CacheItem;
    }
    export abstract class CacheItem extends class_Dfr {
        path: string;
        error: any;
        inputHash: string;
        outputContent: string;
        constructor(path: string);
        abstract load(): any;
        write(currentInput: string, currentOutput: string): any;
        isValid(content: string): boolean;
        protected serialize(): string;
        protected deserialize(str: string): string[];
        protected onCacheFileLoaded(content: string): void;
        protected onError(error: any): void;
    }
}

