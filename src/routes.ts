import { Router } from "express";
import Controller from "./controllers";

const routes = Router();

routes.get("/", (request, response) => {
	response.send("Hello World!");
});

routes.post("/create", Controller.createTime);

routes.get("/list", Controller.listTime);

routes.get("/listIn", Controller.listTimeInterval);

routes.delete("/delete", Controller.deleteTime);

export default routes;
