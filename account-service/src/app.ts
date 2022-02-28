import cors from "cors";
import express from "express";
import { ENV } from "./config/config";
import { accountController } from "./controllers";
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
app.get("/:id", makeExpressCallback(accountController.getAccount));
app.use(makeExpressCallback(notFound));

app.listen(ENV.port, () => {
  console.log(`Starting Account-Service at localhost:${ENV.port}`);
});
