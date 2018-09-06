import { path_combine } from "../../src/utils/path";


UTest({
    'should combine paths' () {
        eq_(path_combine('a', 'b'), 'a/b');
        eq_(path_combine('a/', 'b'), 'a/b');
        eq_(path_combine('a/', '/b'), 'a/b');
        eq_(path_combine('a', 'b'), 'a/b');
    }
})