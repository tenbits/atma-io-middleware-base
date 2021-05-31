import { is_String, is_Function } from 'atma-utils'
import { io } from './dependencies'

import { IMiddlewareDefinition } from './IConfig'
import ConfigProvider  from './ConfigProvider'
import Compiler  from './Compiler'
import Middleware  from './class/Middleware'

/**
 * @middlewareDefintion {
 *     name: string
 *  process (content, path, options, ctx: { file, method })
 *  processAsync (content, path, options, ctx: { file, method }, done)
 *     defaultOptions: {}
 *  textOnly: true "Should serialize content if some previous middleware parsed it to some struct"
 * }
 */
export default function create (middlewareDefinition: IMiddlewareDefinition, IO?: typeof io) {
    let { name, process, processAsync } = middlewareDefinition;
    if (is_String(name) === false) {
        throw Error('Middleware is not valid. Name is undefined');
    }
    if (is_Function(process) === false && is_Function(processAsync) === false) {
        throw Error('Middleware is not valid. At least `process` or `processAsync` methods are expected');
    }
    let config = new ConfigProvider(name, middlewareDefinition.defaultOptions);
    let options = config.load();
    if (options == null) {
        throw Error(`Options for the ${name} middleware are not resolved.`);
    }

    let compiler = new Compiler(middlewareDefinition, options);
    let middleware = new Middleware(middlewareDefinition, options, compiler);
    let ioLib = IO || io;
    if (ioLib != null) {
        middleware.init(io);
    }
    return middleware;
};
