const { 
    io: { File }, 
    utils: { class_create, class_Dfr: Deferred }, 
    toRegexp 
} = require('../package-private');

module.exports = {
    register (io, extMap, middlewareDefinition) {
        let Ctor = class_create(VirtualFile, middlewareDefinition.VirtualFile);
        Object.keys(extMap).forEach(ext => {
            io.File.getFactory().registerHandler(toRegexp(ext), Ctor);
        });
    }
};

const VirtualFile = class_create(File, {

    exists () {
        return true;
    },
    existsAsync () {
        return Promise.resolve(true);
    },
	read (opts) {
        this.content = '';
        io.File.processHooks('read', this, opts);
		return this.content;
	},
	
	readAsync (opts){
        this.content = '';
        const dfr = new Deferred;
        io.File.processHooks('readAsync', this, opts, (error) => {
            if (error) {
                dfr.reject(error);
                return;
            }
            dfr.resolve(this.content);
        });
	},
    write () {
        throw new Error ('Middleware implements no write-logic');
    },
    writeAsync () {
        throw new Error ('Middleware implements no write-logic');
    },
    copyTo (path) {
        this.read();
        this.write(this.content, path);
    },
    copyAsync (path) {
        return this
            .readAsync()
            .then(() => this.writeAsync(this.content, path));
    },
});