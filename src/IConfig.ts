import io from 'atma-io';
import Compiler from './Compiler'
import { LogOptions } from './class/Logger'

export interface IMiddResult {
    content: string | any
    sourceMap?: string | any
}

export interface IMiddlewareProcessFn {
    (content: string | any, file: io.File, compiler: Compiler) : string | IMiddResult | undefined
}

export interface IMiddlewareProcessAsyncFn {
    (content: string | any, file: io.File, compiler: Compiler)  : PromiseLike<string | IMiddResult | undefined>
}

export interface IMiddlewareDefinition {
    name: string
    textOnly?: boolean
    defaultOptions?: IOptions
    isVirtualHandler?: boolean
    process: IMiddlewareProcessFn
    processAsync: IMiddlewareProcessAsyncFn
}

export interface IOptions {
    logger?: LogOptions,
    mimeType?: string
    extensions?: string[] | {[ext: string]: string}
    sourceMap?: boolean
}