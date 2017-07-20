import { createLogger, ILogger } from './class/Logger';
import { IMiddlewareDefinition, IOptions, IMiddResult } from './IConfig'
import io from 'atma-io';

export default class Compiler {
	private logger: ILogger
	private textOnly: boolean
	/** Single temp Configuration: will be passt on each io File read/write calls */
	private currentConfig: any = null

	constructor (
		public middlewareDefinition: IMiddlewareDefinition, 
		public options: IOptions) 
	{
		const { process, processAsync, textOnly = true } = middlewareDefinition;
		this.middlewareDefinition = middlewareDefinition;
		this.process_ = process;
		this.processAsync_ = processAsync;
		
		this.textOnly = textOnly;		
		this.setOptions(options);
	}
	setOptions (opts: IOptions) {
		this.logger = createLogger(this.options.logger || this.middlewareDefinition.defaultOptions.logger);
		this.options = opts;
		this.currentConfig = null;
	}
	getOption (name) {
		let val = this.currentConfig && this.currentConfig[name];
		if (val != null) {
			return val;
		}
		return this.options[name];
	}
	process_ (content: string | any, file: io.File, compiler: Compiler, done?: Function): IMiddResult | void {
		throw Error('Not implemented');		
	}
	processAsync_ (content: string | any, file: io.File, compiler: Compiler, done: Function): any {
		try {
			this.compile(file, this.options);
		} catch (error) {
			done(error);
			return;
		}
		done(null, file);
	}
	compile (file, config) {
		let result = this.run_('process_', file, config);
		this.applyResult_(file, result);
	}
	compileAsync (file, config, done) {
		this.run_('processAsync_', file, config, (error, result) => {
			if (error) {
				done(error);
				return;
			}
			this.applyResult_(file, result);
			done(null, result);
		});
	}

	run_ (method: 'process_' | 'processAsync_', file: io.File, config: any, done?: Function) {
		this.currentConfig = config;
		this.logger.start();
		let isAsync = done != null;
		if (isAsync) {
			done = this.logger.delegateEnd(done);
		}
		let result = this[method](
			this.getContent_(file), 
			file, 
			this, 			 
			done
		);
		if (isAsync === false) {
			this.logger.end();
		}
		return result;
	}
	applyResult_ (file: io.File, result) {
		file.sourceMap = result.sourceMap;
		file.content = result.content;
	}

	getContent_ (file: io.File) : string | any{
		var content = file.content;
		if (typeof content === 'string') {
			return content;
		}
		if (this.textOnly !== true) {
			return content;
		}
		if (content.toString === Object.prototype.toString) {
			return null;
		}
		return content.toString();
	}
}