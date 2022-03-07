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
      addTechnology(makeFakeTechnologyData({ category: "invalid" }))
    ).rejects.toThrow("Technology must have a valid category.");
  });
  it("can add a technology", async () => {
    const technologyDb = makeTechnologyDb({ makeDb });
    const previewTechnologies = buildPreviewTechnologies({ technologyDb });

    const teamId = Id.makeId();
    const technology1 = makeFakeTechnologyData({ teamId });
    const technology2 = makeFakeTechnologyData({ teamId });
    expect(async () => await addTechnology(technology1)).not.toThrow();
    expect(
      async () =>
        await addTechnology(makeFakeTechnologyData({ teamId: Id.makeId() }))
    ).not.toThrow();
    expect(async () => await addTechnology(technology2)).not.toThrow();
    expect(await previewTechnologies({ teamId })).toEqual([
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
        makeFakeTechnologyData({ teamId, id: existingTechnology.id })
      )
    ).rejects.toThrow("Failed to add technologies.");
  });
});
