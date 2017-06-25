module.exports = class Compiler {
	constructor (middlewareDefinition, options) {
		this.options = options;

		const { process, processAsync, textOnly = true } = middlewareDefinition;
		this.middleware_ = process;
		this.middlewareAsync_ = processAsync;
		this.textOnly = textOnly;
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
	compile (file, options) {
		let result = this.process_('middleware_', file, options);
		this.applyResult_(file, result);
	}
	compileAsync (file, options, done) {
		this.process_('middlewareAsync_', file, options, (error, result) => {
			if (error) {
				done(error);
				return;
			}
			this.applyResult_(file, result);
			done(null, result);
		});
	}

	process_ (method, file, options, done) {
		let content = this.getContent_(file);
		let opts = this.options;
		if (options) {
			opts = Object.assign(opts, options);
		}
		let path = file.uri.toLocalFile();
		let ctx = { file, method };		
		return this[method](content, path, opts, ctx, done);
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