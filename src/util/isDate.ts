export default function isDate(day: string) {
	const format = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-20[0-9][0-9]$/;
	if (format.test(day)) {
		return true;
	}
	return false;
}
