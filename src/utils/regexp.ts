export function toRegexp (misc) {
	if (misc[0] === '/') {
		var str = misc.substring(1);
		var end = str.lastIndexOf('/');
		var flags = str.substring(end + 1);
		str = str.substring(0, end);
		return new RegExp(str, flags);
	}
	var rgx = `\\.${misc}($|\\?|#)`;
	return new RegExp(rgx);
};