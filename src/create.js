let ConfigProvider = require('./ConfigProvider');
let Compiler = require('./Compiler');
let Middleware = require('./class/Middleware');
let VirtualFile = require('./class/VirtualFile');
let { io, utils: { is_String, is_Function } } = require('./package-private');

/**
 * @middlewareDefintion {
 * 	name: string
 *  process (content, path, options, ctx: { file, method })
 *  processAsync (content, path, options, ctx: { file, method }, done)
 * 	defaultOptions: {}
 *  textOnly: true "Should serialize content if some previous middleware parsed it to some struct"
 * }
 */
module.exports = function(middlewareDefintion, io_) {
	let { name, process, processAsync } = middlewareDefintion;
	if (is_String(name) === false) {
		throw Error('Middleware is not valid. Name is undefined');
	}	
	if (is_Function(process) === false && is_Function(processAsync) === false) {
		throw Error('Middleware is not valid. At least `process` or `processAsync` methods are expected');
	}
	let config = new ConfigProvider(name, middlewareDefintion.defaultOptions);
	let options = config.load();
	if (options == null) {
		throw Error(`Options for the ${name} middleware are not resolved.`);
	}
	
	let compiler = new Compiler(middlewareDefintion, options);
	let middleware = new Middleware(middlewareDefintion, options, compiler);
	let ioLib = io_ || io;
	if (ioLib != null) {
		middleware.register(io);
	}
	return middleware;
};