import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { ENV } from "./config/config";
import {
  getTechnologiesPreview,
  getTechnology,
  postTechnology,
} from "./controllers";
import { notFound } from "./controllers/not-found";
import { makeExpressCallback } from "./express-callback";

var app = express();

// Cors
var corsOptions = {
  origin: ENV.allowedCorsOrigin,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

app.use(bodyParser.json());

// Routes
app.get("/preview", makeExpressCallback(getTechnologiesPreview));
app.get("/:id", makeExpressCallback(getTechnology));
app.post("/", makeExpressCallback(postTechnology));
app.use(makeExpressCallback(notFound));

app.listen(ENV.port, () => {
  console.log(`Starting Technology-Service at localhost:${ENV.port}`);
});
