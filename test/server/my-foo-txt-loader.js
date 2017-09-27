let Base = require('../../lib/index.js');

module.exports = Base.create({
    name:'my-super-foo-midd',
    mimeType: 'my-plain/text',
    defaultOptions: {
        extensions: [ 'txt' ]
    },
    process (content) {
        return 'UpperCased: ' + content.toUpperCase();
    }
});