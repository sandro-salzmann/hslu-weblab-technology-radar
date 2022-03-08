import { makeTechnology } from ".";
import { Id } from "../Id";
import { makeFakeTechnologyData } from "../__test__/fixtures/technology";

describe("technology", () => {
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
  it("must have a valid team id", () => {
    const nullTeamId = makeFakeTechnologyData({ teamId: null });
    expect(() => makeTechnology(nullTeamId)).toThrow(
      "Technology must have a valid team id."
    );
    const invalidTeamId = makeFakeTechnologyData({ teamId: "invalid" });
    expect(() => makeTechnology(invalidTeamId)).toThrow(
      "Technology must have a valid team id."
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
  it("defaults to unpublished status", () => {
    const noPublishedStatus = makeFakeTechnologyData({ published: undefined });
    expect(makeTechnology(noPublishedStatus).getPublished()).toEqual(false);
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
  it("can have a valid changedBy", () => {
    const id = Id.makeId();
    const changedById = makeFakeTechnologyData({ changedBy: id });
    expect(() => makeTechnology(changedById)).not.toThrow();
    const technology = makeTechnology(changedById);
    expect(technology.getChangedBy()).toBe(id);
  });
  it("cannot have an invalid changedBy", () => {
    const invalidChangedBy = makeFakeTechnologyData({ changedBy: "invalid" });
    expect(() => makeTechnology(invalidChangedBy)).toThrow(
      "Technology must have a valid changedBy."
    );
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
  it("can convert changedAt date strings to ISOString", () => {
    const changedAtValid = makeFakeTechnologyData({
      changedAt: "2017-01-26",
      published: true,
    });
    expect(() => makeTechnology(changedAtValid)).not.toThrow();
    const technology = makeTechnology(changedAtValid);
    expect(technology.getChangedAt()).toBe(
      new Date("2017-01-26").toISOString()
    );
  });
  it("cannot convert invalid changedAt date strings to ISOString", () => {
    const changedAtInvalid = makeFakeTechnologyData({
      changedAt: "invalid",
      published: true,
    });
    expect(() => makeTechnology(changedAtInvalid)).toThrow(
      "changedAt is not a valid date string."
    );
  });
  it("can set a valid name", () => {
    const technologyFakeData = makeFakeTechnologyData({
      published: true,
    });
    const technology = makeTechnology(technologyFakeData);
    expect(() => technology.setName("<svg><g/onload=alert(2)//<p>")).toThrow(
      "Name contains no usable text."
    );
    technology.setName("valid");
    expect(technology.getName()).toEqual("valid");
  });
  it("can set a valid description", () => {
    const technologyFakeData = makeFakeTechnologyData({
      published: true,
    });
    const technology = makeTechnology(technologyFakeData);
    expect(() =>
      technology.setDescription("<svg><g/onload=alert(2)//<p>")
    ).toThrow("Description contains no usable text.");
    technology.setDescription("valid");
    expect(technology.getDescription()).toEqual("valid");
  });
  it("can set a valid maturity description", () => {
    const technologyFakeData = makeFakeTechnologyData({
      published: true,
    });
    const technology = makeTechnology(technologyFakeData);
    expect(() =>
      technology.setMaturityDescription("<svg><g/onload=alert(2)//<p>")
    ).toThrow("Classification description contains no usable text.");
    technology.setMaturityDescription("valid");
    expect(technology.getMaturityDescription()).toEqual("valid");
  });
  it("can set a valid maturity", () => {
    const technologyFakeData = makeFakeTechnologyData({
      published: true,
    });
    const technology = makeTechnology(technologyFakeData);
    // @ts-ignore to test invalid values
    expect(() => technology.setMaturity("invalid")).toThrow(
      "Technology must have a valid maturity."
    );
    technology.setMaturity("assess");
    expect(technology.getMaturity()).toEqual("assess");
  });
  it("can set a valid category", () => {
    const technologyFakeData = makeFakeTechnologyData({
      published: true,
    });
    const technology = makeTechnology(technologyFakeData);
    // @ts-ignore to test invalid values
    expect(() => technology.setCategory("invalid")).toThrow(
      "Technology must have a valid category."
    );
    technology.setCategory("techniques");
    expect(technology.getCategory()).toEqual("techniques");
  });
  it("can set changed information", () => {
    const technologyFakeData = makeFakeTechnologyData({
      published: true,
    });
    const technology = makeTechnology(technologyFakeData);
    // @ts-ignore to test invalid values
    expect(() => technology.hasChanged("invalid")).toThrow(
      "Technology must have a valid changedBy."
    );
    const id = Id.makeId();
    technology.hasChanged(id);
    expect(technology.getChangedBy()).toEqual(id);
    expect(technology.getChangedAt()).toBeDefined();
  });
});
