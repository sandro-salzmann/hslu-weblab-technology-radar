import { makeTechnology } from ".";
import { makeFakeTechnologyData } from "../__test__/fixtures/technology";

describe("technology-preview", () => {
  it("must have a valid id", () => {
    const nullId = makeFakeTechnologyData({ id: null });
    expect(() => makeTechnology(nullId)).toThrow(
      "Technology must have a valid id."
    );
    const invalidId = makeFakeTechnologyData({ id: "invalid" });
    expect(() => makeTechnology(invalidId)).toThrow(
      "Technology must have a valid id."
    );
  });
  it("must have a valid published status", () => {
    const nullStatus = makeFakeTechnologyData({ published: null });
    expect(() => makeTechnology(nullStatus)).toThrow(
      "Technology must have a valid published status."
    );
    const invalidStatus = makeFakeTechnologyData({ published: "invalid" });
    expect(() => makeTechnology(invalidStatus)).toThrow(
      "Technology must have a valid published status."
    );
  });
  it("can have a valid published status", () => {
    const notPublished = makeFakeTechnologyData({ published: false });
    expect(() => makeTechnology(notPublished)).not.toThrow();
    const technology = makeTechnology(notPublished);
    expect(technology.getPublished()).toBe(false);
  });
  it("must have a valid category", () => {
    const nullCategory = makeFakeTechnologyData({ category: null });
    expect(() => makeTechnology(nullCategory)).toThrow(
      "Technology must have a valid category."
    );
    const invalidCategory = makeFakeTechnologyData({ category: "invalid" });
    expect(() => makeTechnology(invalidCategory)).toThrow(
      "Technology must have a valid category."
    );
  });
  it("can have a valid maturity", () => {
    const assessCategory = makeFakeTechnologyData({ maturity: "assess" });
    expect(() => makeTechnology(assessCategory)).not.toThrow();
    const technology = makeTechnology(assessCategory);
    expect(technology.getMaturity()).toBe("assess");
  });
  it("can have a category", () => {
    const platformsCategory = makeFakeTechnologyData({ category: "platforms" });
    expect(() => makeTechnology(platformsCategory)).not.toThrow();
    const technology = makeTechnology(platformsCategory);
    expect(technology.getCategory()).toBe("platforms");
  });
  it("can have a maturity when not published", () => {
    const holdMaturity = makeFakeTechnologyData({
      maturity: "hold",
      published: false,
    });
    expect(() => makeTechnology(holdMaturity)).not.toThrow();
    const technology = makeTechnology(holdMaturity);
    expect(technology.getMaturity()).toBe("hold");
  });
  it("must have a maturity when published", () => {
    const publishedWithoutMaturity = makeFakeTechnologyData({
      maturity: undefined,
      published: true,
    });
    expect(() => makeTechnology(publishedWithoutMaturity)).toThrow(
      "Technology must have a valid maturity."
    );
  });
  it("must have a name", () => {
    const nullName = makeFakeTechnologyData({ name: null });
    expect(() => makeTechnology(nullName)).toThrow(
      "Technology must have a name."
    );
    const emptyName = makeFakeTechnologyData({ name: undefined });
    expect(() => makeTechnology(emptyName)).toThrow(
      "Technology must have a name."
    );
  });
  it("must have a description", () => {
    const nullDescription = makeFakeTechnologyData({
      description: null,
    });
    expect(() => makeTechnology(nullDescription)).toThrow(
      "Technology must have a description."
    );
    const emptyDescription = makeFakeTechnologyData({
      description: undefined,
    });
    expect(() => makeTechnology(emptyDescription)).toThrow(
      "Technology must have a description."
    );
  });
  it("can have a description classification when unpublished", () => {
    const nullMaturityDescription = makeFakeTechnologyData({
      maturityDescription: null,
      published: false,
    });
    expect(() => makeTechnology(nullMaturityDescription)).not.toThrow();
    const emptyMaturityDescription = makeFakeTechnologyData({
      maturityDescription: undefined,
      published: false,
    });
    expect(() => makeTechnology(emptyMaturityDescription)).not.toThrow();
    const withMaturityDescription = makeFakeTechnologyData({
      maturityDescription: "example",
      published: false,
    });
    expect(() => makeTechnology(withMaturityDescription)).not.toThrow();
  });
  it("must have a description classification when published", () => {
    const nullMaturityDescription = makeFakeTechnologyData({
      maturityDescription: null,
      published: true,
    });
    expect(() => makeTechnology(nullMaturityDescription)).toThrow(
      "Technology must have a classification description."
    );
    const emptyMaturityDescription = makeFakeTechnologyData({
      maturityDescription: undefined,
      published: true,
    });
    expect(() => makeTechnology(emptyMaturityDescription)).toThrow(
      "Technology must have a classification description."
    );
  });
  it("must sanitize the name", () => {
    const htmlEmptyName = makeFakeTechnologyData({
      name: "<img src=x onerror=alert(1)//>",
    });
    expect(() => makeTechnology(htmlEmptyName)).toThrow(
      "Name contains no usable text."
    );
  });
  it("must sanitize the description", () => {
    const htmlEmptyDescription = makeFakeTechnologyData({
      description: "<svg><g/onload=alert(2)//<p>",
    });
    expect(() => makeTechnology(htmlEmptyDescription)).toThrow(
      "Description contains no usable text."
    );
  });
  it("must sanitize the description classification", () => {
    const htmlEmptyDescription = makeFakeTechnologyData({
      maturityDescription: "<script></script>",
    });
    expect(() => makeTechnology(htmlEmptyDescription)).toThrow(
      "Classification description contains no usable text."
    );
  });
  it("can convert publishedAt date strings to ISOString", () => {
    const publishedAtValid = makeFakeTechnologyData({
      publishedAt: "2017-01-26",
      published: true,
    });
    expect(() => makeTechnology(publishedAtValid)).not.toThrow();
    const technology = makeTechnology(publishedAtValid);
    expect(technology.getPublishedAt()).toBe(
      new Date("2017-01-26").toISOString()
    );
  });
  it("cannot convert invalid publishedAt date strings to ISOString", () => {
    const publishedAtInvalid = makeFakeTechnologyData({
      publishedAt: "invalid",
      published: true,
    });
    expect(() => makeTechnology(publishedAtInvalid)).toThrow(
      "PublishedAt is not a valid date string."
    );
  });
  it("cannot publish already published technologies", () => {
    const publishedTechnology = makeTechnology(
      makeFakeTechnologyData({
        published: false,
      })
    );
    expect(() => publishedTechnology.publish()).not.toThrow();
    expect(() => publishedTechnology.publish()).toThrow(
      "Technology is already published"
    );
  });
  it("cannot publish technology without maturity set", () => {
    const publishedTechnology = makeTechnology(
      makeFakeTechnologyData({
        published: false,
        maturity: undefined,
      })
    );
    expect(() => publishedTechnology.publish()).toThrow(
      "Maturity needs to be set before publishing"
    );
  });
  it("cannot publish technology without maturity description set", () => {
    const publishedTechnology = makeTechnology(
      makeFakeTechnologyData({
        published: false,
        maturityDescription: undefined,
      })
    );
    expect(() => publishedTechnology.publish()).toThrow(
      "Maturity description needs to be set before publishing"
    );
  });
  it("sets published and publishedAt when publishing", () => {
    const publishedTechnology = makeTechnology(
      makeFakeTechnologyData({
        published: false,
        publishedAt: undefined,
      })
    );
    publishedTechnology.publish();
    expect(publishedTechnology.getPublished()).toEqual(true);
    expect(publishedTechnology.getPublishedAt()).toBeDefined();
  });
});
