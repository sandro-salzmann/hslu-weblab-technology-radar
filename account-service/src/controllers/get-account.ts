import { Authorization } from "common";
import { Request } from "express";
import { HttpResponse } from ".";
import { ListAccountFn } from "../use-cases/list-account";

type MakeGetAccountFn = ({
  listAccount,
}: {
  listAccount: ListAccountFn;
}) => (
  props: Request<{ id: string }, {}, {}>,
  authorization: Authorization
) => Promise<HttpResponse>;

export const makeGetAccount: MakeGetAccountFn =
  ({ listAccount }) =>
  async (httpRequest, { teamId }) => {
    const headers = {
      "Content-Type": "application/json",
    };
    try {
      let account = await listAccount({
        accountId: httpRequest.params.id,
        teamId,
      });
      return {
        headers,
        statusCode: 200,
        body: account,
      };
    } catch (e: any) {
      // TODO: error handling
      return {
        headers,
        statusCode: 400,
        body: {
          error: e?.message,
        },
      };
    }
  };
