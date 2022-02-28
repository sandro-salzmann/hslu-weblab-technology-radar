import { Request } from "express";
import { HttpResponse } from ".";
import { ListAccountFn } from "../use-cases/list-account";

type MakeGetAccountFn = ({
  listAccount,
}: {
  listAccount: ListAccountFn;
}) => (props: Request<{ id: string }, {}, {}>) => Promise<HttpResponse>;

export const makeGetAccount: MakeGetAccountFn =
  ({ listAccount }) =>
  async httpRequest => {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      const account = await listAccount({
        accountId: httpRequest.params.id,
      });
      return {
        headers,
        statusCode: 200,
        body: account,
      };
    } catch (e: any) {
      console.error(e); // TODO: better error handling
      return {
        headers,
        statusCode: 400,
        body: {
          error: e?.message,
        },
      };
    }
  };
