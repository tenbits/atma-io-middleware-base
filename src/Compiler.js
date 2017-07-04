const { create: createLogger } = require('class/Logger.js');
module.exports = class Compiler {
	constructor (middlewareDefinition, options) {
		const { process, processAsync, textOnly = true } = middlewareDefinition;
		this.middlewareDefinition = middlewareDefinition;
		this.process_ = process;
		this.processAsync_ = processAsync;
		
		this.textOnly = textOnly;
		this.curentConfig = null;		
		this.setOptions(options);
	}
	setOptions (opts) {
		this.logger = createLogger(this.options.logger || this.middlewareDefinition.logger);
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
	process_ (content, file, compiler) {
		throw Error('Not implemented');
		return { content: null, sourceMap: null };
	}
	processAsync_ (content, file, compiler, done) {
		try {
			this.compile(file, options);
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

	run_ (method, file, config, done) {
		this.currentConfig = config;
		this.logger.lock();
		let isAsync = done != null;
		if (isAsync) {
			done = this.logger.wrap(done);
		}
		let result = this[method](
			this.getContent_(file), 
			file, 
			this, 			 
			done
		);
		if (isAsync === false) {
			this.logger.release();
		}
		return result;
	}
	applyResult_ (file, result) {
		file.sourceMap = result.sourceMap;
		file.content = result.content;
	}

	getContent_ (file) {
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