const { io: { File }, utils: { class_create }} = require('../package-private');

module.exports = {
    create (logOptions) {
        let type = logOptions == null ? null : logOptions.type;
        switch (type) {
            case 'silent': 
                return new NoLogger();
            case 'file':
                return new FileLogger(logOptions);
            case 'custom':
                return new CustomLogger(logOptions);
            case 'std':
            default:
                return new ILogger();
        }
    }
}
const ILogger = class_create({
    constructor (logOptions) {
        this.options = logOptions;
    },
    lock () {},
    release () {},
    wrap (onComplete) {
       return onComplete;
    },
    write () {}
});

const DefaultLogger = class_create(ILogger, {
    lock () {
        Interceptor.hook(this);
    },
    release () {
        Interceptor.unhook();
    },
    wrap (onComplete) {
        if (onComplete == null) {
            return onComplete;
        }
        
        return (error, ...args) => {
            if (error != null) {
                this.write('stderr', error.message);
            }
            this.release();
            onComplete.apply(null, [error, ...args]);
        };
    },
    write () {

    }
});

const NoLogger = class_create(DefaultLogger, {
    
});

const FileLogger = class_create(DefaultLogger, {
    constructor () {
        this.buffer = [];
    },
    release () {
        File.write(this.options.file, this.buffer.join('\n'));
    },
    write (type, str) {
        this.buffer.push(str);
    }
});

const CustomLogger = class_create(DefaultLogger, {
    constructor (opts) {
        this.write = opts.write;
        if (typeof this.write !== 'function') {
            throw Error('Custom logger should export the `write` method');
        }
    }
})


let Interceptor;
(function () {
    let _process = global.process;
    let _stdOutWrite = _process.stdout.write;
    let _stdErrWrite = _process.stderr.write;
    let _currentListener = null;

    Interceptor = {
        hook (listener) {
            _currentListener = listener;
            setMethods(onStdOut, onStdErr);
        },
        unhook () {
            setMethods(null, null);
        }
    };

    function setMethods (stdOutFn, stdErrFn) {
        _process.stdout.write = stdOutFn || _stdOutWrite;
        _process.stderr.write = stdErrFn || _stdErrWrite;
    }
    function onStdOut (str) {
        if (_currentListener == null) {
            return;
        }
        _currentListener.write('stdout', str);
    };
    function onStdErr () {
        if (_currentListener == null) {
            return;
        }
        _currentListener.write('stderr', str);
    }
}());