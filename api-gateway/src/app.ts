import cors from "cors";
import express from "express";
import { createProxyMiddleware, Options } from "http-proxy-middleware";
import { ENV } from "./config/config.js";
import { checkAuthentication } from "./middleware/checkAuthentication.js";
import { injectAuthorization } from "./middleware/injectAuthorization.js";

const app = express();

// Cors
var corsOptions = {
  origin: ENV.allowedCorsOrigin,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// Check authentication and attach authorization data on all requests
app.use("", checkAuthentication, injectAuthorization);

// Proxy options for adding verified claims to all requests
const proxyOptions: Options = {
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    if (!req.user) {
      return res.sendStatus(403);
    }
    proxyReq.setHeader(
      "Authorization",
      JSON.stringify(req.user.verifiedClaims)
    );
  },
  onProxyRes: (proxyRes) => {
    delete proxyRes.headers["Authorization"];
  },
};

// Proxy endpoints
app.use(
  "/technology",
  createProxyMiddleware({
    target: ENV.technologyServiceURL,
    pathRewrite: {
      [`^/technology`]: "", // removes /technology from api call
    },
    ...proxyOptions,
  })
);
app.use(
  "/account",
  createProxyMiddleware({
    target: ENV.accountServiceURL,
    pathRewrite: {
      [`^/account`]: "", // removes /account from api call
    },
    ...proxyOptions,
  })
);
app.get("/permissions", (req, res) => {
  if (req.user) {
    res.status(200).json(req.user.verifiedClaims);
  } else {
    res.status(500).send({ error: "User claims not found." });
  }
});

// Start the proxy
app.listen(ENV.port, ENV.host, () => {
  console.log(`Starting proxy at ${ENV.host}:${ENV.port}`);
});
