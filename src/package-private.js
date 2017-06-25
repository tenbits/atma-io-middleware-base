module.exports = {
	io: global.io && global.io.File ? global.io : require('atma-io'),
	utils: require('atma-utils')
};