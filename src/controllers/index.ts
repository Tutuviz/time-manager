import { Request, Response } from "express";

import Model from "../models";
import totalDays from "../util/totalDays";
import hourToMinutes from "../util/hourToMinutes";

export interface schedule {
	day: string;
	intervals: [
		{
			start: string;
			end: string;
		}
	];
}

const createTime = (req: Request, res: Response) => {
	const { day, intervals } = req.body;
	const data = Model.getSchedule();

	// In the same day
	if (data.some((schedule: schedule) => schedule.day === day)) {
		res.status(409).json({
			message: "Conflict, day already scheduled",
		});
	} else {
		data.push({ day, intervals });
	}

	const response = Model.postSchedule(data);
	if (!response) {
		res.status(503).json({
			message: "Internal Error",
		});
	}

	return res.status(201).json({
		message: "Created",
	});
};

const deleteTime = (req: Request, res: Response) => {
	const { day, intervals } = req.body;

	const data = Model.getSchedule();

	function filterData(schedule: schedule) {
		if (
			schedule.day != day ||
			JSON.stringify(schedule.intervals) !== JSON.stringify(intervals)
		) {
			return true;
		}
		return false;
	}

	const newData = data.filter(filterData);

	if (JSON.stringify(data) === JSON.stringify(newData)) {
		return res.status(400).json({
			message: "Conflict",
		});
	}

	const response = Model.deleteSchedule(newData);
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

	return res.json(response);
};

const listTimeInterval = (req: Request, res: Response) => {
	const { initDay, endDay } = req.body;

	function filterData(schedule: schedule) {
		if (
			typeof schedule.day === "string" &&
			(schedule.day === "everyday" ||
				(totalDays(schedule.day) >= totalDays(initDay) &&
					totalDays(schedule.day) <= totalDays(endDay)))
		) {
			return true;
		}
		return false;
	}

	const response = Model.getScheduleFiltered(filterData);
	res.json(response);
};

export default { createTime, deleteTime, listTime, listTimeInterval };
