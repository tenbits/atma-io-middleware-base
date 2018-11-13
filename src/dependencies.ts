import * as utils from 'atma-utils'
import * as io from 'atma-io';

let globalIo: typeof io = (<any>global).io;
if (globalIo == null || globalIo.File == null) {
    globalIo = io;
}

export { globalIo as io, utils }

