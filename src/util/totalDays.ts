export default function totalDays(input: string) {
	const dayArray = input.split("-").map(Number);
	const totalDays = dayArray[0] + dayArray[1] * 30 + dayArray[2] * 365;

	return totalDays;
}
