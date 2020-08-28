export default function isHour(hour: string) {
	const format = /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/;
	if (format.test(hour)) {
		return true;
	}
	return false;
}
