const { create: createLogger } = require('class/Logger.js');
module.exports = class Compiler {
	constructor (middlewareDefinition, options) {
		const { process, processAsync, textOnly = true } = middlewareDefinition;
		this.middlewareDefinition = middlewareDefinition;
		this.middleware_ = process;
		this.middlewareAsync_ = processAsync;
		
		this.textOnly = textOnly;
		this.setOptions(options);
	}
	setOptions (opts) {
		this.options = opts;
		this.logger = createLogger(this.options.logger || this.middlewareDefinition.logger);
	}
	middleware_ (content, path, options, ctx) {
		throw Error('Not implemented');
		return { content: null, sourceMap: null };
	}
	middlewareAsync_ (content, path, options, ctx, done) {
		try {
			this.compile(file, options);
		} catch (error) {
			done(error);
			return;
		}
		done(null, file);
	}
	compile (file, config) {
		let result = this.process_('middleware_', file, config);
		this.applyResult_(file, result);
	}
	compileAsync (file, config, done) {
		this.process_('middlewareAsync_', file, config, (error, result) => {
			if (error) {
				done(error);
				return;
			}
			this.applyResult_(file, result);
			done(null, result);
		});
	}

	process_ (method, file, config, done) {
		this.logger.lock();
		let isAsync = done != null;
		if (isAsync) {
			done = this.logger.wrap(done);
		}
		let result = this[method](
			this.getContent_(file), 
			file.uri.toLocalFile(), 
			this.options, 
			{ file, method, config }, 
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