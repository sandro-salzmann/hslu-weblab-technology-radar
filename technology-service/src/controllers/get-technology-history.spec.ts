import { makeFakeTechnologyData } from "../__test__/fixtures/technology";
import { makeGetTechnologyHistory } from "./get-technology-history";

describe("get technology history controller", () => {
  it("successfully gets a technology history", async () => {
    const fakeTechnology = makeFakeTechnologyData();
    const getTechnologyHistory = makeGetTechnologyHistory({
      listTechnologyHistory: async ({ teamId, technologyId }) =>
        // @ts-ignore doesn't need to return correct value
        teamId === "call-with-this-teamid" ? technologyId : null,
    });
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      params: { technologyId: fakeTechnology.id },
    };
    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 200,
      body: fakeTechnology.id,
    };
    // @ts-expect-error because the request object is incomplete on purpose
    const actual = await getTechnologyHistory(request, {
      teamId: "call-with-this-teamid",
    });
    expect(actual).toEqual(expected);
  });

  it("reports user errors", async () => {
    const getTechnologyHistory = makeGetTechnologyHistory({
      listTechnologyHistory: () => {
        throw Error("Oops!");
      },
    });
    const fakeTechnology = makeFakeTechnologyData();
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      params: { technologyId: fakeTechnology.id },
    };
    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 400,
      body: { error: "Oops!" },
    };
    // @ts-expect-error because the request object is incomplete on purpose
    const actual = await getTechnologyHistory(request, {});
    expect(actual).toEqual(expected);
  });

  describe("technologyId param validation", () => {
    const fakeTechnology = makeFakeTechnologyData();
    const getTechnologyHistory = makeGetTechnologyHistory({
      // @ts-ignore doesn't need to return correct value
      listTechnologyHistory: async () => fakeTechnology.id,
    });

    const shouldFail = async (technologyId: any) => {
      const request = {
        headers: {
          "Content-Type": "application/json",
        },
        params: { technologyId },
      };
      // @ts-expect-error because the request object is incomplete on purpose
      const actual = await getTechnologyHistory(request, {});
      expect(actual.statusCode).toEqual(400);
      expect(actual.body?.error).toMatch(
        new RegExp("^Config validation error:")
      );
    };

    it("rejects null", async () => shouldFail(null));
    it("rejects undefined", async () => shouldFail(undefined));
    it("rejects invalid", async () => shouldFail("invalid"));
  });
});
