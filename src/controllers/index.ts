import { Request, Response } from "express";
import fs from "fs";

const createTime = (req: Request, res: Response) => {
	const { day, intervals } = req.body;

	const data = fs.readFileSync("./src/data/index.json");
	const newData = JSON.parse(data.toString());
	newData.push({ day, intervals });

	fs.writeFileSync("./src/data/index.json", JSON.stringify(newData, null, " "));
	listTime(req, res);
};

const deleteTime = (req: Request, res: Response) => {};

const listTime = (req: Request, res: Response) => {
	const data = fs.readFileSync("./src/data/index.json");
	return res.send(data);
};

const listTimeInterval = (req: Request, res: Response) => {};

export default { createTime, deleteTime, listTime, listTimeInterval };
