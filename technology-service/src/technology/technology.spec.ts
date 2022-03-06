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
  it("must have a valid maturity", () => {
    const nullMaturity = makeFakeTechnologyData({ maturity: null });
    expect(() => makeTechnology(nullMaturity)).toThrow(
      "Technology must have a valid maturity."
    );
    const invalidMaturity = makeFakeTechnologyData({ maturity: "invalid" });
    expect(() => makeTechnology(invalidMaturity)).toThrow(
      "Technology must have a valid maturity."
    );
  });
  it("can have a category", () => {
    const platformsCategory = makeFakeTechnologyData({ category: "platforms" });
    expect(() => makeTechnology(platformsCategory)).not.toThrow();
    const technology = makeTechnology(platformsCategory);
    expect(technology.getCategory()).toBe("platforms");
  });
  it("can have a maturity", () => {
    const holdMaturity = makeFakeTechnologyData({ maturity: "hold" });
    expect(() => makeTechnology(holdMaturity)).not.toThrow();
    const technology = makeTechnology(holdMaturity);
    expect(technology.getMaturity()).toBe("hold");
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
  it("must have a description classification", () => {
    const nullDescriptionClassification = makeFakeTechnologyData({
      descriptionClassification: null,
    });
    expect(() => makeTechnology(nullDescriptionClassification)).toThrow(
      "Technology must have a classification description."
    );
    const emptyDescriptionClassification = makeFakeTechnologyData({
      descriptionClassification: undefined,
    });
    expect(() => makeTechnology(emptyDescriptionClassification)).toThrow(
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
      descriptionClassification: "<script></script>",
    });
    expect(() => makeTechnology(htmlEmptyDescription)).toThrow(
      "Classification description contains no usable text."
    );
  });
});