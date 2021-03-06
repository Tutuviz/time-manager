import { Request, Response } from "express";
import moment from "moment";

import Model from "../models";
import totalDays from "../util/totalDays";

export interface schedule {
	day: string;
	intervals: [intervalInterface];
}

interface intervalInterface {
	start: string;
	end: string;
}

const createTime = (req: Request, res: Response) => {
	const { day, intervals } = req.body;
	const data = Model.getSchedule();

	if (
		intervals.some((input: intervalInterface) => input.start >= input.end) ||
		intervals.some(
			(input: intervalInterface) =>
				!moment(input.start, "HH:mm").isValid() ||
				!moment(input.end, "HH:mm").isValid()
		) ||
		(typeof day == "number" && (day < 0 || day > 6)) ||
		(typeof day == "string" &&
			!moment(day, "DD-MM-YYYY").isValid() &&
			day !== "everyday")
	) {
		return res.status(400).json({
			message: "Bad Request",
		});
	}

	const index = data.findIndex(
		(schedule: schedule) =>
			schedule.day === moment(day, "DD-MM-YYYY").format("DD-MM-YYYY")
	);

	let updated = false;
	if (index >= 0) {
		let conflicting = false;
		intervals.forEach((input: intervalInterface) => {
			data[index].intervals.forEach((appointment: intervalInterface) => {
				if (
					!updated &&
					(input.start > appointment.end || input.end < appointment.start)
				) {
					updated = true;
					data[index].intervals.push(...intervals);
				} else {
					conflicting = true;
				}
			});
		});
		if (conflicting && !updated) {
			return res.status(409).json({
				message: "Conflict",
			});
		}
	} else {
		data.push({ day, intervals });
	}

	const response = Model.postSchedule(data);
	if (!response) {
		res.status(503).json({
			message: "Internal Error",
		});
	}

	if (updated) {
		return res.status(200).json({
			message: "Updated",
		});
	}

	return res.status(201).json({
		message: "Created",
	});
};

const deleteTime = (req: Request, res: Response) => {
	const { day, intervals } = req.body;

	const data = Model.getSchedule();

	const index = data.findIndex(
		(schedule: schedule) =>
			schedule.day === day &&
			JSON.stringify(schedule.intervals) === JSON.stringify(intervals)
	);

	if (index < 0) {
		return res.status(404).json({
			message: "Not Found",
		});
	}

	const response = Model.deleteSchedule(index);
	if (!response) {
		return res.status(503).json({
			message: "Internal Error",
		});
	}

	return res.json({
		message: "Delete Successful",
	});
};

const listTime = (req: Request, res: Response) => {
	const response = Model.getSchedule();

	if (!response.length) {
		return res.status(404).json({
			message: "Not found",
		});
	}
	return res.json(response);
};

const listTimeInterval = (req: Request, res: Response) => {
	const { from, to } = req.body;

	const start = moment(from, "DD-MM-YYYY");
	const end = moment(to, "DD-MM-YYYY");

	if (!start.isValid() || !start.isValid() || start > end) {
		return res.status(400).json({
			message: "Bad Request",
		});
	}

	function filterData(schedule: schedule) {
		if (
			typeof schedule.day === "string" &&
			(schedule.day === "everyday" ||
				(totalDays(schedule.day) >= totalDays(from) &&
					totalDays(schedule.day) <= totalDays(to)))
		) {
			return true;
		}
		return false;
	}

	const response = Model.getScheduleFiltered(filterData);

	const index = response.findIndex(
		(schedule: schedule) => schedule.day === "everyday"
	);
	if (index >= 0) {
		const loop = moment(start);
		while (loop <= end) {
			response.push({
				day: loop.format("DD-MM-YYYY"),
				intervals: response[index].intervals,
			});
			loop.add(1, "days");
		}
		response.splice(index, 1);
	}

	if (!response.length) {
		return res.status(404).json({
			message: "Not found",
		});
	}
	res.json(response);
};

export default { createTime, deleteTime, listTime, listTimeInterval };
