import cors from "cors";
import express from "express";
import { ENV } from "./config/config";
import { technologyController } from "./controllers";
import { notFound } from "./controllers/not-found";
import { makeExpressCallback } from "./express-callback";

var app = express();

// Cors
var corsOptions = {
  origin: ENV.allowedCorsOrigin,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// Routes
const { getTechnologiesPreview, getTechnology } = technologyController;
app.get("/preview", makeExpressCallback(getTechnologiesPreview));
app.get("/:id", makeExpressCallback(getTechnology));
app.use(makeExpressCallback(notFound));

app.listen(ENV.port, () => {
  console.log(`Starting Technology-Service at localhost:${ENV.port}`);
});
