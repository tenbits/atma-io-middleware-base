let ConfigProvider = require('./ConfigProvider');
let Compiler = require('./Compiler');
let Middleware = require('./class/Middleware');
let { io, utils: { is_String, is_Function } } = require('./package-private');

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