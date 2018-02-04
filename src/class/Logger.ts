import { io } from '../dependencies';

export function createLogger (options: LogOptions = { type: 'std'}) {
    switch (options.type) {
        case 'silent': 
            return new SilentLogger(options);
        case 'file':
            return new FileLogger(options);
        case 'custom':
            return new CustomLogger(options);
        case 'std':
        default:
            return new StdLogger(options);
    }
};

export interface LogOptions {
    type: 'silent' | 'file' | 'custom' | 'std'
    interceptStd?: boolean
    file?: string
    write?: (x: string) => void
    [key: string]: any
}
export abstract class ILogger {
    constructor (public options: LogOptions) {        

    }
    start () {
        if (this.options.interceptStd) {
            Interceptor.hook(this);
        }
    }
    end () {
        if (this.options.interceptStd) {
            Interceptor.unhook();
        }
    }
    delegateEnd (onComplete: Function): Function {
        if (onComplete == null) {
            return null;
        }
        return (error: Error, ...args) => {
            if (error != null) {
                this.write(error.message);
            }
            this.end();
            onComplete.apply(null, [error, ...args]);
        };
    }
    abstract write (x: string, level?: 'error' | 'warn' | 'info')

    log (...args: any[]) {
        let message = args.join(' ');
        this.write(message, 'info');
    }
    warn (...args: any[]) {
        let message = args.join(' ');
        this.write(message, 'warn');
    }
    error (...args: any[]) {
        let message = args.join(' ');
        this.write(message, 'error');
    }
};

export class StdLogger extends ILogger {
    write(x: string) {
        console.log(x);
    }
}

export class SilentLogger extends ILogger {
    constructor (opts) {
        super(opts);
        this.options.interceptStd = true;
    }
    
    write (x: string) {

    }
};

class FileLogger extends SilentLogger {
    buffer: string[] = []
    lock () {

    }
    release () {
        io.File.write(this.options.file, this.buffer.join('\n'));
    }
    write (str) {
        this.buffer.push(str);
    }
};

class CustomLogger extends SilentLogger {
    constructor (opts) {
        super(opts);
        if (typeof this.options.write !== 'function') {
            throw Error('Custom logger should export the `write` method');
        }
    }
    write (x) {
        this.options.write(x);
    }
}


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
    function onStdErr (str) {
        if (_currentListener == null) {
            return;
        }
        _currentListener.write('stderr', str);
    }
}());