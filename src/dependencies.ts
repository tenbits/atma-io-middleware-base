import * as IO from 'atma-io'
import * as utils from 'atma-utils'

const globalIo: typeof IO = (<any>global).io;
const io = globalIo && globalIo.File ? globalIo : IO;

export { io, utils }

