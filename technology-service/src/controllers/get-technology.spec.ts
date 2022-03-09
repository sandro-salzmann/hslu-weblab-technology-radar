import { makeFakeTechnologyData } from "../__test__/fixtures/technology";
import { makeGetTechnology } from "./get-technology";

describe("get technology controller", () => {
  it("successfully gets a technology", async () => {
    const fakeTechnology = makeFakeTechnologyData();
    const getTechnology = makeGetTechnology({
      listTechnology: async ({ teamId, technologyId }) =>
        teamId === "call-with-this-teamid"
          ? {
              ...fakeTechnology,
              id: technologyId,
            }
          : makeFakeTechnologyData(),
    });
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      params: { id: fakeTechnology.id },
    };
    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 200,
      body: fakeTechnology,
    };
    // @ts-expect-error because the request object is incomplete on purpose
    const actual = await getTechnology(request, {
      teamId: "call-with-this-teamid",
    });
    expect(actual).toEqual(expected);
  });

  it("reports user errors", async () => {
    const getTechnology = makeGetTechnology({
      listTechnology: () => {
        throw Error("Oops!");
      },
    });
    const fakeTechnology = makeFakeTechnologyData();
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      params: { id: fakeTechnology.id },
    };
    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 400,
      body: { error: "Oops!" },
    };
    // @ts-expect-error because the request object is incomplete on purpose
    const actual = await getTechnology(request, {});
    expect(actual).toEqual(expected);
  });

  describe("technologyId param validation", () => {
    const fakeTechnology = makeFakeTechnologyData();
    const getTechnology = makeGetTechnology({
      listTechnology: async () => fakeTechnology,
    });

    const shouldFail = async (id: any) => {
      const request = {
        headers: {
          "Content-Type": "application/json",
        },
        params: { id },
      };
      // @ts-expect-error because the request object is incomplete on purpose
      const actual = await getTechnology(request, {});
      expect(actual.statusCode).toEqual(400);
      expect(actual.body?.error).toMatch(
        new RegExp("^Request validation error:")
      );
    };

    it("rejects null", async () => shouldFail(null));
    it("rejects undefined", async () => shouldFail(undefined));
    it("rejects invalid", async () => shouldFail("invalid"));
  });
});
