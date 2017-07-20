import io_ from 'atma-io'
import utils from 'atma-utils'

const globalIo = (global as any).io;
const io = globalIo && globalIo.File ? <typeof io_> globalIo : io_;

export { io, utils }

