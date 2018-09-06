export function path_combine (...slugs: string[]) {
    let out = '';
    for (let i = 0; i < slugs.length; i++) {
        let str = slugs[i];
        if (!str) {
            continue;
        }
        if (out === '') {
            out = str;
            continue;
        }
        out = out.replace(/[\/\\]+$/, '') + '/' + str.replace(/^[\/\\]+/, '');
    }
    return out;
}