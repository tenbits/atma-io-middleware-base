import SourceMapFile from './SourceMapFile';
import { register } from './VirtualFile';
import AtmaServer from '../AtmaServer';
import Compiler from '../Compiler'
import {IMiddlewareDefinition, IOptions} from '../IConfig'
import {obj_extendMany, obj_extend} from 'atma-utils'
import { io } from '../dependencies'
import { Utils } from '../ConfigProvider'

let _currentIo: typeof io = null;

export default class Middleware {
	name: string

	constructor (
		public middlewareDefintion: IMiddlewareDefinition, 
		public options: IOptions, 
		public compiler: Compiler) 
	{
		let { name } = middlewareDefintion;

		this.options = obj_extendMany({}, middlewareDefintion.defaultOptions, options);
		this.name = name;

	}
	process (file, config) {
		this.compiler.compile(file, config);
	}
	processAsync (file, config, done) {
		this.compiler.compileAsync(file, config, done);
	}
	init (io_: typeof io, extraOptions?) {
		_currentIo = io_;

		io_.File.middleware[this.name] = this;
		let opts = this.options;
		if (extraOptions) {
			this.setOptions(extraOptions)
		}
		let {extensions, sourceMap} = opts;		
		let extensionsMap = normalizeExtensions(extensions, this.name);

		registerExtensions(io_.File, extensionsMap, sourceMap);	

		if (this.middlewareDefintion.isVirtualHandler) {
			register(io_, extensionsMap, this.middlewareDefintion);
		}
		this.compiler.onMount(_currentIo);
	}
	

	/** Atma-Server */
	attach (app) {
		let globalOpts = obj_extend({}, this.options);
		let appOptions = app.config && (app.config.$get(`settings.${this.name}`) || app.config.$get(`${this.name}`));
		if (appOptions) {
			globalOpts = obj_extend(globalOpts, appOptions);
		}
		let extensions = globalOpts.extensions;
		if (extensions) {
			extensions = normalizeExtensions(extensions, this.name);
		}
		AtmaServer.attach(app, extensions, this, globalOpts);
	}

	/** Atma.Plugin */
	register (appcfg) {
		let extraOptions = Utils.readOptions(appcfg, this.name);
		if (extraOptions == null) {
			return;			
		}
		this.setOptions(extraOptions)

		let { extensions, sourceMap } = extraOptions;
		if (extensions) {
			let extensionsMap = normalizeExtensions(extensions, this.name);

			if (_currentIo) {
				registerExtensions(_currentIo.File, extensionsMap, sourceMap);	
			}
		}
		if (appcfg.actions && this.middlewareDefintion.action) {
			appcfg.actions[this.name] = this.middlewareDefintion.action;
		}
	}
	
	/** IO **/
	read (file, config) {
		this.process(file, config);
	}
	readAsync (file, config, done) {
		this.processAsync(file, config, done);	
	}
	write (file, config) {
		this.process(file, config);
	}
	writeAsync (file, config, done) {
		this.processAsync(file, config, done);	
	}
	setOptions (opts) {
		this.options = obj_extendMany({}, this.middlewareDefintion.defaultOptions, opts);
		this.compiler.setOptions(this.options);
	}
};

/**
 * Prepair Extensions Map Object for the io.File.registerExtensions 
 * @param {Array|Object} mix
 * @return {Object} Example: { fooExt: ['current-midd-name:read'] } 
 */
function normalizeExtensions (mix, name) {
	let map = {};
	if (mix == null) {
		return map;
	}
	if (Array.isArray(mix)) {
		mix.forEach(ext => map[ext] = [`${name}:read`]);
		return map;
	} 
	for(let ext in mix) {
		let str = mix[ext] || 'read', 
			types;
		if (str.indexOf(',') > -1) {
			types = str.trim().split(',').map(x => x.trim());
		} else {
			types = [str.trim()];
		}
		map[ext] = [];
		types.forEach(type => map[ext].push(`${name}:${type}`));
	}
	return map;
}

function registerExtensions (File, extMap, withSourceMap = false) {
	File.registerExtensions(extMap);
	
	if (withSourceMap) {
		for (let ext in extMap) {
			File.getFactory().registerHandler(
				new RegExp('\\.' + ext + '.map$', 'i')
				, SourceMapFile
			); 
		}
	}
}
