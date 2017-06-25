let { io: { File } } = require('../package-private');
let { class_Dfr: Deferred } = require('atma-utils');

module.exports = class SourceMapFile extends File {
	constructor () {
		super(...arguments)
	}
	read (opts) {
		if (this.exists('mapOnly')) 
			return super.read(opts)
		
		var path = this.getSourcePath();
		if (path == null) 
			return null;
		
		var file = new File(path);
		file.read(opts);
		return (this.content = file.sourceMap);
	}
	
	readAsync (opts){
		if (this.exists('mapOnly')) 
			return super.readAsync(opts)
		
		var path = this.getSourcePath();
		if (path == null) 
			return new Deferred.reject({code: 404});
		
		var file = new File(path);
		return file
			.readAsync(opts)
			.then(() => {
				return (this.content = file.sourceMap);
			});
	}
	exists (check) {
		if (super.exists()) 
			return true;
		if (check === 'mapOnly') 
			return false;
		
		var path = this.getSourcePath();
		return path != null
			? File.exists(path)
			: false;
	}

	getSourcePath () {
		var path = this.uri.toString(),
			source = path.replace(/\.map$/i, '');
		return path === source
			? null
			: source;
	}
};