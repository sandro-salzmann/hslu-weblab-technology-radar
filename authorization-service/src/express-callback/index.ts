import { Request, Response } from "express";
import { HttpResponse } from "../controllers";

export type ControllerFn = (httpRequest: any) => Promise<HttpResponse>;

export const makeExpressCallback =
  (controller: ControllerFn) => (req: Request, res: Response) => {
    const httpRequest = {
      body: req.body,
      query: req.query,
      params: req.params,
      ip: req.ip,
      method: req.method,
      path: req.path,
      headers: {
        "Content-Type": req.get("Content-Type"),
        Referer: req.get("referer"),
        "User-Agent": req.get("User-Agent"),
        Authorization: req.get("Authorization"),
      },
    };

    controller(httpRequest)
      .then((httpResponse) => {
        if (httpResponse.headers) {
          res.set(httpResponse.headers);
        }
        res.type("json");
        res.status(httpResponse.statusCode).send(httpResponse.body);
      })
      .catch((e) =>
        res.status(500).send({ error: "An unkown error occurred." })
      );
  };
