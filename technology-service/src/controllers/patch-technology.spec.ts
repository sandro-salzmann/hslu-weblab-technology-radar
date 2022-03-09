import { makeTechnology } from "../technology";
import { makeFakeTechnologyData } from "../__test__/fixtures/technology";
import { makePatchTechnology } from "./patch-technology";

describe("patch technology controller", () => {
  it("successfully patches a technology", async () => {
    const fakeTechnology = makeFakeTechnologyData();
    const patchTechnology = makePatchTechnology({
      editTechnology: async (technology) =>
        technology.teamId === "call-with-this-teamid" &&
        technology.name === fakeTechnology.name &&
        technology.category === fakeTechnology.category &&
        technology.description === fakeTechnology.description &&
        technology.maturity === fakeTechnology.maturity &&
        technology.maturityDescription === fakeTechnology.maturityDescription &&
        technology.published === fakeTechnology.published
          ? makeTechnology(fakeTechnology)
          : makeTechnology(makeFakeTechnologyData()),
    });
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        id: fakeTechnology.id,
        name: fakeTechnology.name,
        category: fakeTechnology.category,
        description: fakeTechnology.description,
        maturity: fakeTechnology.maturity,
        maturityDescription: fakeTechnology.maturityDescription,
        published: fakeTechnology.published,
      },
    };
    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 200,
      body: fakeTechnology,
    };
    // @ts-expect-error because the request object is incomplete on purpose
    const actual = await patchTechnology(request, {
      teamId: "call-with-this-teamid",
    });
    expect(actual).toEqual(expected);
  });

  it("reports user errors", async () => {
    const patchTechnology = makePatchTechnology({
      editTechnology: () => {
        throw Error("Oops!");
      },
    });
    const fakeTechnology = makeFakeTechnologyData();
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        id: fakeTechnology.id,
        name: fakeTechnology.name,
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
    const actual = await patchTechnology(request, {});
    expect(actual).toEqual(expected);
  });

  describe("param validation", () => {
    const fakeTechnology = makeFakeTechnologyData();
    const patchTechnology = makePatchTechnology({
      editTechnology: async () => makeTechnology(fakeTechnology),
    });

    const shouldFail = async (bodyOverride: any = {}) => {
      const request = {
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          id: fakeTechnology.id,
          name: fakeTechnology.name,
          category: fakeTechnology.category,
          description: fakeTechnology.description,
          maturity: fakeTechnology.maturity,
          maturityDescription: fakeTechnology.maturityDescription,
          published: fakeTechnology.published,
          ...bodyOverride,
        },
      };
      // @ts-expect-error because the request object is incomplete on purpose
      const actual = await patchTechnology(request, {});
      expect(actual.statusCode).toEqual(400);
      expect(actual.body?.error).toMatch(
        new RegExp("^Request validation error:")
      );
    };

    const shouldNotFail = async (bodyOverride: any = {}) => {
      const request = {
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          id: fakeTechnology.id,
          name: fakeTechnology.name,
          category: fakeTechnology.category,
          description: fakeTechnology.description,
          maturity: fakeTechnology.maturity,
          maturityDescription: fakeTechnology.maturityDescription,
          published: fakeTechnology.published,
          ...bodyOverride,
        },
      };
      // @ts-expect-error because the request object is incomplete on purpose
      const actual = await patchTechnology(request, {});
      expect(actual.statusCode).toEqual(200);
    };

    it("rejects id null", async () => shouldFail({ id: null }));
    it("rejects id undefined", async () => shouldFail({ id: undefined }));
    it("rejects id invalid", async () => shouldFail({ id: "invalid" }));
    it("rejects name null", async () => shouldFail({ name: null }));
    it("accepts name undefined", async () =>
      shouldNotFail({ name: undefined }));
    it("rejects category null", async () => shouldFail({ category: null }));
    it("accepts category undefined", async () =>
      shouldNotFail({ category: undefined }));
    it("rejects description null", async () =>
      shouldFail({ description: null }));
    it("accepts description undefined", async () =>
      shouldNotFail({ description: undefined }));
    it("rejects maturity null", async () => shouldFail({ maturity: null }));
    it("accepts maturity undefined", async () =>
      shouldNotFail({ maturity: undefined }));
    it("rejects maturityDescription null", async () =>
      shouldFail({ maturityDescription: null }));
    it("accepts maturityDescription undefined", async () =>
      shouldNotFail({ maturityDescription: undefined }));
    it("rejects published null", async () => shouldFail({ published: null }));
    it("rejects published invalid", async () =>
      shouldFail({ published: "invalid" }));
    it("accepts published undefined", async () =>
      shouldNotFail({ published: undefined }));
  });
});
