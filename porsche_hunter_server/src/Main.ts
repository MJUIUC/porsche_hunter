import express from "express";
import logger from "morgan";

import { router as HunterAuthServiceController } from "./service_controllers/HunterAuthServiceController";
import { router as WallServiceController } from "./service_controllers/WallServiceController";
import { router as ImageServiceController } from "./service_controllers/ImageServiceController";
import { router as HunterPostServiceController } from "./service_controllers/HunterPostServiceController";

const PORT = 8080;
const app = express();

// NOTE: app.use middleware is executed in the order it is defined.

// parse application/json
app.use(express.json());
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
app.use(logger("dev"));

app.get("/", (req, res) => {
  res.send("Porsche Hunter Server V1.0.0");
});

const API_URL = "/api/v1";
app.use(`${API_URL}/auth`, HunterAuthServiceController);
// Auth required for all routes below this line.
app.use(`${API_URL}/wall`, WallServiceController);
app.use(`${API_URL}/post`, HunterPostServiceController);
app.use(`/mini-cdn`, ImageServiceController);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
