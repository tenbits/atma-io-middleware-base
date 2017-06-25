Atma IO Middleware Abstraction
-----

Helper util to create atma-io middlewares

Extends:

- [`atma-io`](https://github.com/atmajs/atma-io) with a custom middleware to read/compile/preprocess files

For usage examples refer to:
- [atma-io-middleware-eslint](https://github.com/tenbits/atma-io-middleware-eslint)

#### API

###### create
```javascript
var { create } = require('atma-io-middleware-base');
create({
    name: 'my-super-middleware',
    process (content: string, filename: string, options: string) {
        return { content: string, sourceMap: string };
    }
    processAsync (content: string, filename: string, options: string) {
        return Promise.resolve({content: string, sourceMap: string});
    }
})
```

`options` can be extended then via `package.json`. Example:
```json
{

    "settings": {
        "%middleware-name%": {
            "foo": "baz"
        }
    }

}

```

----
_ 2017 (c) MIT License - Atma.js Project_