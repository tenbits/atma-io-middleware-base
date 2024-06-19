import { Hashable } from '../../src/CacheProvider'

UTest({
    'should combine paths' () {
        let str = `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`;
        let x1 = Hashable.doHash(str);
        let x2 = Hashable.doHash(`aaaaaaaaaaaaaaaaaaaaaaaaaaaaabaaaaaaaaaaaaaaaaaaaa`);

        console.log(x1 === x2, x1, x2)

    }
})
