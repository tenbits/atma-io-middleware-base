import * as io_ from 'atma-io'
import * as utils from 'atma-utils'



const globalIo = (global as any).io;
const io = globalIo && globalIo.File ? <typeof io_> globalIo : io_;

export { io, utils }

