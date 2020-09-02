import express from "express";
import routes from "./routes";

const app = express();

app.use(express.json());
app.use(routes);

const port = 8081;

app.listen(port, () => {
	console.log(`Server running at port ${port}`);
});
