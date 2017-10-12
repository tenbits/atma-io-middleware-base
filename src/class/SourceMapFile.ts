import { io } from '../dependencies';
import { class_Dfr } from 'atma-utils';

export default class SourceMapFile extends io.File {
	read (opts) {
		if (this.exists('mapOnly')) 
			return super.read(opts)
		
		var path = this.getSourcePath();
		if (path == null) 
			return null;
		
		var file = new io.File(path);
		file.read(opts);
		return (this.content = file.sourceMap);
	}
	
	readAsync (opts){
		if (this.exists('mapOnly')) 
			return super.readAsync(opts)
		
		var path = this.getSourcePath();
		if (path == null) {
			return new class_Dfr().reject({
				code: 404, 
				filename: this.uri.toLocalFile(), 
				message: 'Path equals original'
			}) as PromiseLike<any>
		}
		
		let file = new io.File(path);
		let prom = file.readAsync(opts);
		return prom.then(() => {
			return (this.content = file.sourceMap);
		});
	}
	exists (check?) {
		if (super.exists()) 
			return true;
		if (check === 'mapOnly') 
			return false;
		
		var path = this.getSourcePath();
		return path != null
			? io.File.exists(path)
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