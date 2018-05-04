/// <reference path="../node_modules/atma-io/types/global.d.ts" />

import { createLogger, ILogger } from './class/Logger';
import { IMiddlewareDefinition, IOptions, IMiddResult, IMiddlewareProcessAsyncFn, IMiddlewareProcessFn } from './IConfig'
import { io } from './dependencies';
import { class_Dfr, obj_getProperty } from 'atma-utils';

export default class Compiler {
	public logger: ILogger
	public textOnly: boolean
	/** Single temp Configuration: will be passt on each io File read/write calls */
	public currentConfig: any = null
	public name: string

	protected process_:  IMiddlewareProcessFn
	protected processAsync_: IMiddlewareProcessAsyncFn

	public utils?: any

	constructor (
		public middlewareDefinition: IMiddlewareDefinition, 
		public options: IOptions) 
	{
		const { name, process, processAsync, textOnly = true } = middlewareDefinition;
		this.middlewareDefinition = middlewareDefinition;
		this.process_ = process;
		this.processAsync_ = processAsync;
		
		this.name = name;
		this.utils = middlewareDefinition.utils;
		this.textOnly = textOnly;		
		this.setOptions(options);
	}
	setOptions (opts: IOptions) {
		this.logger = createLogger(opts.logger || this.options.logger || this.middlewareDefinition.defaultOptions.logger);
		this.options = opts;
		this.currentConfig = null;
	}
	getOption (property) {
		if (this.currentConfig != null) {
			let options = obj_getProperty(this.currentConfig, `settings.${this.name}`)
				|| obj_getProperty(this.currentConfig, `${this.name}`)
				|| this.currentConfig;
			
			var x = obj_getProperty(options, property);
			if (x != null) {
				return x;
			}
		}
		return obj_getProperty(this.options, property);
	}
	onMount (io) {
		this.middlewareDefinition.onMount && this.middlewareDefinition.onMount(io);
	}
	
	compile (file, config, method: 'read' | 'write'): string | IMiddResult | undefined {
		this.currentConfig = config;
		let result = this.process_(this.getContent_(file), file, this, method);
		this.applyResult_(file, result);
		return null;
	}
	compileAsync (file, config, done, method: 'read' | 'write') {
		this.currentConfig = config;

		let fn = this.processAsync_;
		if (fn == null) {
			try {
				let result = this.compile(file, config, method);
				this.applyResult_(file, result);
				setTimeout(() => done());
			}
			catch (error) {
				setTimeout(() => done(error));
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

	private applyResult_ (file: io.File, result: string | IMiddResult | undefined) {
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

	private getContent_ (file: io.File) : string | any{
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