import io from 'atma-io';
import Compiler from './Compiler'
import { LogOptions } from './class/Logger'

export interface IMiddResult {
    content: string | any
    sourceMap?: string | any
}
export interface IMiddlewareDefinition {
    name: string
    textOnly?: boolean
    defaultOptions?: IOptions
    isVirtualHandler?: boolean
    process: (content: string | any, file: io.File, compiler: Compiler, ...args) => IMiddResult | void
    processAsync: (content: string | any, file: io.File, compiler: Compiler, done: ((result?: PromiseLike<IMiddResult> | void) => void)) => void
}

export interface IOptions {
    logger?: LogOptions,
    mimeType?: string
    extensions?: string[] | {[ext: string]: string}
    sourceMap?: boolean
}