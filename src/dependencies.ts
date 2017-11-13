import * as utils from 'atma-utils'

const globalIo = (<any>global).io;
const io = globalIo && globalIo.File ? globalIo : require('atma-io');

export { io, utils }

