import { makeTechnologyDb } from "../data-access/technology-db";
import { Id } from "../Id";
import {
  insertTechnology,
  makeDb,
  restoreBackup,
} from "../__test__/fixtures/db";
import { makeFakeTechnologyData } from "../__test__/fixtures/technology";
import { makeTechnologyPreviewOf } from "../__test__/fixtures/technology-preview";
import { AddTechnologyFn, buildAddTechnology } from "./add-technology";
import { buildPreviewTechnologies } from "./preview-technologies";

describe("add technology", () => {
  let addTechnology: AddTechnologyFn;

  beforeAll(async () => {
    const technologyDb = makeTechnologyDb({ makeDb });
    addTechnology = buildAddTechnology({ technologyDb });
  });

  beforeEach(async () => {
    restoreBackup();
  });

  it("requires a valid technology", () => {
    expect(
      addTechnology(
        makeFakeTechnologyData({ category: "invalid" }),
        Id.makeId()
      )
    ).rejects.toThrow("Technology must have a valid category.");
  });
  it("requires a valid accountId", () => {
    expect(addTechnology(makeFakeTechnologyData(), "invalid")).rejects.toThrow(
      "You must supply a accountId"
    );
  });
  it("can add a technology", async () => {
    const technologyDb = makeTechnologyDb({ makeDb });
    const previewTechnologies = buildPreviewTechnologies({ technologyDb });

    const teamId = Id.makeId();
    const technology1 = makeFakeTechnologyData({ teamId });
    const technology2 = makeFakeTechnologyData({ teamId });
    expect(addTechnology(technology1, Id.makeId())).resolves.not.toThrow();
    expect(
      addTechnology(
        makeFakeTechnologyData({ teamId: Id.makeId() }),
        Id.makeId()
      )
    ).resolves.not.toThrow();
    expect(addTechnology(technology2, Id.makeId())).resolves.not.toThrow();
    expect(previewTechnologies({ teamId })).resolves.toEqual([
      makeTechnologyPreviewOf(technology1),
      makeTechnologyPreviewOf(technology2),
    ]);
  });
  it("can't add a technology that already exists", async () => {
    const teamId = Id.makeId();
    const existingTechnology = makeFakeTechnologyData({ teamId });
    await insertTechnology(existingTechnology);

    expect(
      addTechnology(
        makeFakeTechnologyData({ teamId, id: existingTechnology.id }),
        Id.makeId()
      )
    ).rejects.toThrow("Failed to add technologies.");
  });
});
