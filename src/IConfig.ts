import * as io from 'atma-io';
import Compiler from './Compiler'
import { LogOptions } from './class/Logger'

export interface IMiddResult {
    content: string | any
    sourceMap?: string | any
}

export interface IMiddlewareProcessFn {
    (content: string | any, file?: io.File, compiler?: Compiler) : string | IMiddResult | undefined
}

export interface IMiddlewareProcessAsyncFn {
    (content: string | any, file?: io.File, compiler?: Compiler)  : PromiseLike<string | IMiddResult | undefined>
}

export interface IMiddlewareDefinition {
    name: string
    textOnly?: boolean
    defaultOptions?: IOptions
    isVirtualHandler?: boolean
    VirtualFile?: IVirtualFileDefinition
    process?: IMiddlewareProcessFn
    processAsync?: IMiddlewareProcessAsyncFn
    onMount?: (ioLib: typeof io) => void
    action?: IAtmaActionDefinition
}

export interface IOptions {
    logger?: LogOptions,
    mimeType?: string
    extensions?: string[] | {[ext: string]: string}
    sourceMap?: boolean
    [key: string]: any
}

export interface IVirtualFileDefinition {
    exists? (): boolean 
    existsAsync? (): PromiseLike<boolean>
	read? (opts?: any): any	
    readAsync? (opts?: any): PromiseLike<any>    
    write? (content: any, opts?: any): this 
    writeAsync? (content: any, opts?: any): PromiseLike<void>
    copyTo? (path: string): this
    copyAsync? (path: string): Promise<void> 
}

export interface IAtmaActionDefinition {
    help?: {
        description?: string,
        args?: {
            [key: string]: string
        }
        process (config: object, done: Function): any | void
    }
}