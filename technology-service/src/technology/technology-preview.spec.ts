import { makeTechnologyPreview } from ".";
import { makeFakeTechnologyPreviewData } from "../__test__/fixtures/technology-preview";

describe("technology-preview", () => {
  it("must have a valid id", () => {
    const nullId = makeFakeTechnologyPreviewData({ id: null });
    expect(() => makeTechnologyPreview(nullId)).toThrow(
      "Technology preview must have a valid id."
    );
    const invalidId = makeFakeTechnologyPreviewData({ id: "invalid" });
    expect(() => makeTechnologyPreview(invalidId)).toThrow(
      "Technology preview must have a valid id."
    );
  });
  it("must have a valid category", () => {
    const nullCategory = makeFakeTechnologyPreviewData({ category: null });
    expect(() => makeTechnologyPreview(nullCategory)).toThrow(
      "Technology preview must have a valid category."
    );
    const invalidCategory = makeFakeTechnologyPreviewData({
      category: "invalid",
    });
    expect(() => makeTechnologyPreview(invalidCategory)).toThrow(
      "Technology preview must have a valid category."
    );
  });
  it("must have a valid maturity", () => {
    const invalidMaturity = makeFakeTechnologyPreviewData({
      maturity: "invalid",
    });
    expect(() => makeTechnologyPreview(invalidMaturity)).toThrow(
      "Technology preview must have a valid maturity."
    );
  });
  it("must have a valid published status", () => {
    const nullStatus = makeFakeTechnologyPreviewData({ published: null });
    expect(() => makeTechnologyPreview(nullStatus)).toThrow(
      "Technology preview must have a valid published status."
    );
    const invalidStatus = makeFakeTechnologyPreviewData({
      published: "invalid",
    });
    expect(() => makeTechnologyPreview(invalidStatus)).toThrow(
      "Technology preview must have a valid published status."
    );
  });
  it("can have a valid published status", () => {
    const notPublished = makeFakeTechnologyPreviewData({ published: false });
    expect(() => makeTechnologyPreview(notPublished)).not.toThrow();
    const technology = makeTechnologyPreview(notPublished);
    expect(technology.getPublished()).toBe(false);
  });
  it("can have a category", () => {
    const platformsCategory = makeFakeTechnologyPreviewData({
      category: "platforms",
    });
    expect(() => makeTechnologyPreview(platformsCategory)).not.toThrow();
    const preview = makeTechnologyPreview(platformsCategory);
    expect(preview.getCategory()).toBe("platforms");
  });
  it("can have a maturity", () => {
    const holdMaturity = makeFakeTechnologyPreviewData({ maturity: "hold" });
    expect(() => makeTechnologyPreview(holdMaturity)).not.toThrow();
    const preview = makeTechnologyPreview(holdMaturity);
    expect(preview.getMaturity()).toBe("hold");
  });
  it("must have a name", () => {
    const nullName = makeFakeTechnologyPreviewData({ name: null });
    expect(() => makeTechnologyPreview(nullName)).toThrow(
      "Technology preview must have a name."
    );
    const emptyName = makeFakeTechnologyPreviewData({ name: undefined });
    expect(() => makeTechnologyPreview(emptyName)).toThrow(
      "Technology preview must have a name."
    );
  });
  it("must have a description preview", () => {
    const nullDescriptionPreview = makeFakeTechnologyPreviewData({
      descriptionPreview: null,
    });
    expect(() => makeTechnologyPreview(nullDescriptionPreview)).toThrow(
      "Technology preview must have a description."
    );
    const emptyDescriptionPreview = makeFakeTechnologyPreviewData({
      descriptionPreview: undefined,
    });
    expect(() => makeTechnologyPreview(emptyDescriptionPreview)).toThrow(
      "Technology preview must have a description."
    );
  });
  it("must sanitize the name", () => {
    const htmlEmptyName = makeFakeTechnologyPreviewData({
      name: "<svg><g/onload=alert(2)//<p>",
    });
    expect(() => makeTechnologyPreview(htmlEmptyName)).toThrow(
      "Name contains no usable text."
    );
  });
  it("must sanitize the description preview", () => {
    const htmlEmptyDescriptionPreview = makeFakeTechnologyPreviewData({
      descriptionPreview: "<svg><g/onload=alert(2)//<p>",
    });
    expect(() => makeTechnologyPreview(htmlEmptyDescriptionPreview)).toThrow(
      "Description preview contains no usable text."
    );
  });
});
