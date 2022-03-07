import { Id } from "../Id";
import { makeFakeTechnologyData } from "../__test__/fixtures/technology";
import { makePostTechnology } from "./post-technology";

describe("post technology controller", () => {
  it("successfully posts a technology", async () => {
    const fakeTechnology = makeFakeTechnologyData();
    const technologyId = Id.makeId();
    const postTechnology = makePostTechnology({
      addTechnology: async (technology) =>
        technology.teamId === "call-with-this-teamid"
          ? { id: technologyId }
          : { id: Id.makeId() },
    });
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        name: fakeTechnology.name,
        category: fakeTechnology.category,
        description: fakeTechnology.description,
        maturity: fakeTechnology.maturity,
        maturityDescription: fakeTechnology.maturityDescription,
      },
    };
    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 201,
      body: { id: technologyId },
    };
    // @ts-expect-error because the request object is incomplete on purpose
    const actual = await postTechnology(request, {
      teamId: "call-with-this-teamid",
    });
    expect(actual).toEqual(expected);
  });

  it("reports user errors", async () => {
    const postTechnology = makePostTechnology({
      addTechnology: () => {
        throw Error("Oops!");
      },
    });
    const fakeTechnology = makeFakeTechnologyData();
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        name: fakeTechnology.name,
        category: fakeTechnology.category,
        description: fakeTechnology.description,
        maturity: fakeTechnology.maturity,
        maturityDescription: fakeTechnology.maturityDescription,
      },
    };
    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 400,
      body: { error: "Oops!" },
    };
    // @ts-expect-error because the request object is incomplete on purpose
    const actual = await postTechnology(request, {});
    expect(actual).toEqual(expected);
  });

  describe("param validation", () => {
    const fakeTechnology = makeFakeTechnologyData();
    const postTechnology = makePostTechnology({
      addTechnology: async () => ({ id: fakeTechnology.id }),
    });

    const shouldFail = async (bodyOverride: any = {}) => {
      const request = {
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          name: fakeTechnology.name,
          category: fakeTechnology.category,
          description: fakeTechnology.description,
          maturity: fakeTechnology.maturity,
          maturityDescription: fakeTechnology.maturityDescription,
          ...bodyOverride,
        },
      };
      // @ts-expect-error because the request object is incomplete on purpose
      const actual = await postTechnology(request, {});
      expect(actual.statusCode).toEqual(400);
      expect(actual.body?.error).toMatch(
        new RegExp("^Config validation error:")
      );
    };

    const shouldNotFail = async (bodyOverride: any = {}) => {
      const request = {
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          name: fakeTechnology.name,
          category: fakeTechnology.category,
          description: fakeTechnology.description,
          maturity: fakeTechnology.maturity,
          maturityDescription: fakeTechnology.maturityDescription,
          ...bodyOverride,
        },
      };
      // @ts-expect-error because the request object is incomplete on purpose
      const actual = await postTechnology(request, {});
      expect(actual.statusCode).toEqual(201);
    };

    it("rejects name null", async () => shouldFail({ name: null }));
    it("rejects name undefined", async () => shouldFail({ name: undefined }));
    it("rejects category null", async () => shouldFail({ category: null }));
    it("rejects category undefined", async () =>
      shouldFail({ category: undefined }));
    it("rejects description null", async () =>
      shouldFail({ description: null }));
    it("rejects description undefined", async () =>
      shouldFail({ description: undefined }));
    it("accepts maturity undefined", async () =>
      shouldNotFail({ maturity: undefined }));
    it("rejects maturity null", async () => shouldFail({ maturity: null }));
    it("accepts maturityDescription undefined", async () =>
      shouldNotFail({ maturityDescription: undefined }));
    it("rejects maturityDescription null", async () =>
      shouldFail({ maturityDescription: null }));
  });
});
