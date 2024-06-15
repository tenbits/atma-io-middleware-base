import { createLogger, ILogger } from './class/Logger';
import { IMiddlewareDefinition, IOptions, IMiddResult, IMiddlewareProcessAsyncFn, IMiddlewareProcessFn } from './IConfig'
import { io } from './dependencies';
import { obj_getProperty, class_Uri } from 'atma-utils';

declare type File = InstanceType<typeof io.File>
export default class Compiler {

    public logger: ILogger
    public textOnly: boolean
    /** Single temp Configuration: will be passt on each io File read/write calls */
    public currentConfig: any = null
    public name: string

    protected process_: IMiddlewareProcessFn
    protected processAsync_: IMiddlewareProcessAsyncFn

    protected handler: {
        transformConfig? (file, config, compiler?: Compiler)
    }

    public utils?: any
    public io = io;


    constructor(
        public middlewareDefinition: IMiddlewareDefinition,
        public options: IOptions) {
        const { name, process, processAsync, textOnly = true } = middlewareDefinition;
        this.middlewareDefinition = middlewareDefinition;
        this.process_ = process;
        this.processAsync_ = processAsync;

        if (options.handlerPath) {
            this.handler = require(class_Uri.combine(global.process.cwd(), options.handlerPath));
        }

        this.name = name;
        this.utils = middlewareDefinition.utils;
        this.textOnly = textOnly;
        this.setOptions(options);
    }
    setConfig(config: any): this {
        this.currentConfig = config;
        return this;
    }
    setOptions(opts: IOptions) {
        this.logger = createLogger(opts.logger || this.options.logger || this.middlewareDefinition.defaultOptions.logger);
        this.options = opts;
        this.currentConfig = null;
    }
    getOption(property) {
        if (this.currentConfig != null) {
            let options = obj_getProperty(this.currentConfig, `settings.${this.name}`)
                || obj_getProperty(this.currentConfig, `${this.name}`)
                || this.currentConfig;

            let x = obj_getProperty(options, property);
            if (x != null) {
                return x;
            }
        }
        return obj_getProperty(this.options, property);
    }
    onMount(io) {
        this.io = io;
        this.middlewareDefinition.onMount?.(io);
    }

    compile(file, config, method: 'read' | 'write'): string | IMiddResult | undefined {
        this.currentConfig = config;
        if (this.handler?.transformConfig) {
            this.currentConfig = this.handler.transformConfig(file, config, this);
        }

        let result = this.process_(this.getContent_(file), file, this, method);
        this.applyResult_(file, result);
        return null;
    }
    compileAsync(file, config, done, method: 'read' | 'write') {
        this.currentConfig = config;
        if (this.handler?.transformConfig) {
            this.currentConfig = this.handler.transformConfig(file, config, this);
        }

        let fn = this.processAsync_;
        if (fn == null) {
            try {
                let result = this.compile(file, config, method);
                this.applyResult_(file, result);
                setImmediate(() => done());
            }
            catch (error) {
                setImmediate(() => done(error));
            }
            return;
        }
        this
            .processAsync_(
                this.getContent_(file),
                file,
                this,
                method
            )
            .then(result => {
                this.applyResult_(file, result);
                done();
            }, error => done(error));
    }

    private applyResult_(file: File, result: string | IMiddResult | undefined) {
        if (result == null) {
            return;
        }
        if (typeof result === 'string') {
            file.content = result;
            return;
        }
        file.sourceMap = result.sourceMap;
        file.content = result.content;
    }

    private getContent_(file: File): string | any {
        let content = file.content;
        if (content == null) {
            return null;
        }
        if (typeof content === 'string') {
            return content;
        }
        if (this.textOnly !== true) {
            return content;
        }
        if (content.toString == null || content.toString === Object.prototype.toString) {
            return content;
        }
        return content.toString();
    }
}
