import { makeFakeTechnologyPreviewData } from "../__test__/fixtures/technology-preview";
import { makeGetTechnologiesPreview } from "./get-technologies-preview";

describe("get technologies preview controller", () => {
  it("successfully gets technologies preview", async () => {
    const fakeTechnologyPreview = makeFakeTechnologyPreviewData();
    const getTechnologiesPreview = makeGetTechnologiesPreview({
      previewTechnologies: async ({ teamId }) =>
        teamId === "call-with-this-teamid"
          ? [fakeTechnologyPreview, fakeTechnologyPreview]
          : [],
    });
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      query: {},
    };
    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 200,
      body: [fakeTechnologyPreview, fakeTechnologyPreview],
    };
    // @ts-expect-error because the request object is incomplete on purpose
    const actual = await getTechnologiesPreview(request, {
      teamId: "call-with-this-teamid",
    });
    expect(actual).toEqual(expected);
  });

  it("successfully gets technologies preview by category", async () => {
    const toolsTechnologyPreview = makeFakeTechnologyPreviewData({
      category: "tools",
    });
    const getTechnologiesPreview = makeGetTechnologiesPreview({
      previewTechnologies: async ({ teamId, category }) =>
        teamId === "call-with-this-teamid" && category === "tools"
          ? [toolsTechnologyPreview, toolsTechnologyPreview]
          : [],
    });
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      query: { category: "tools" },
    };
    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 200,
      body: [toolsTechnologyPreview, toolsTechnologyPreview],
    };
    // @ts-expect-error because the request object is incomplete on purpose
    const actual = await getTechnologiesPreview(request, {
      teamId: "call-with-this-teamid",
    });
    expect(actual).toEqual(expected);
  });

  it("reports user errors", async () => {
    const getTechnologiesPreview = makeGetTechnologiesPreview({
      previewTechnologies: () => {
        throw Error("Oops!");
      },
    });
    const request = {
      headers: {
        "Content-Type": "application/json",
      },
      query: { category: "tools" },
    };
    const expected = {
      headers: {
        "Content-Type": "application/json",
      },
      statusCode: 400,
      body: { error: "Oops!" },
    };
    // @ts-expect-error because the request object is incomplete on purpose
    const actual = await getTechnologiesPreview(request, {});
    expect(actual).toEqual(expected);
  });

  describe("category param validation", () => {
    const fakeTechnologyPreview = makeFakeTechnologyPreviewData();
    const getTechnologiesReview = makeGetTechnologiesPreview({
      previewTechnologies: async () => [fakeTechnologyPreview],
    });

    const shouldFail = async (category: any) => {
      const request = {
        headers: {
          "Content-Type": "application/json",
        },
        query: { category },
      };
      // @ts-expect-error because the request object is incomplete on purpose
      const actual = await getTechnologiesReview(request, {});
      expect(actual.statusCode).toEqual(400);
      expect(actual.body?.error).toMatch(
        new RegExp("^Request validation error:")
      );
    };

    it("rejects null", async () => shouldFail(null));
    it("rejects invalid", async () => shouldFail("invalid"));
  });
});
