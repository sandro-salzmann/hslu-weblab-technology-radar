import { listAccount } from "../use-cases";
import { makeGetAccount } from "./get-account";

export interface HttpResponse {
  headers: any;
  statusCode: number;
  body: any;
}

const getAccount = makeGetAccount({ listAccount });

export const accountController = Object.freeze({
  getAccount,
});
