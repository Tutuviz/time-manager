import express from "express";
import routes from "./routes";

const app = express();

app.use(express.json());
app.use(routes);

app.listen(8081, () => {
	console.log("Server running at port 8081");
});
