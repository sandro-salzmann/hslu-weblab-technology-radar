import axios from "axios";
import { NextFunction, Request, Response } from "express";
import { ENV } from "../config/config.js";

export const injectAuthorization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.sendStatus(403);
  }

  const accountId = req.user["https://techradar.ch/claims/uuid"];
  const email = req.user["https://techradar.ch/claims/email"];

  try {
    const accountResponse = await axios.get(
      `${ENV.authorizationServiceUrl}/${accountId}?email=${email}`
    );
    if (accountResponse.status !== 200) {
      throw {
        message: `Could not get account with id ${accountId}. Status: ${accountResponse.status}`,
        response: accountResponse,
      };
    }

    const { teamId, teamRole } = accountResponse.data;
    req.user.verifiedClaims = { accountId, teamId, teamRole };

    next();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error.");
  }
};
