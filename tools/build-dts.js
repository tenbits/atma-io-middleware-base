var dts = require('dts-bundle');

dts.bundle({
	name: 'atma-io-middleware-base',
	main: './ts-temp/export.d.ts',
	out: './out/index.d.ts'
});

io.File.copyTo('./ts-temp/out/index.d.ts', './lib/index.d.ts');