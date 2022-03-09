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
        Id.makeId(),
        "LEADER"
      )
    ).rejects.toThrow("Technology must have a valid category.");
  });
  it("requires a valid accountId", () => {
    expect(
      addTechnology(makeFakeTechnologyData(), "invalid", "LEADER")
    ).rejects.toThrow("You must supply a accountId");
  });
  it("requires a leader role", () => {
    expect(
      addTechnology(makeFakeTechnologyData(), Id.makeId(), "MEMBER")
    ).rejects.toThrow("You don't have permissions to create technologies.");
  });
  it("can add a technology", async () => {
    const technologyDb = makeTechnologyDb({ makeDb });
    const previewTechnologies = buildPreviewTechnologies({ technologyDb });

    const teamId = Id.makeId();
    const technology1 = makeFakeTechnologyData({ teamId, published: false });
    const technology2 = makeFakeTechnologyData({ teamId, published: false });
    expect(
      addTechnology(technology1, Id.makeId(), "LEADER")
    ).resolves.not.toThrow();
    expect(
      addTechnology(
        makeFakeTechnologyData({ teamId: Id.makeId() }),
        Id.makeId(),
        "LEADER"
      )
    ).resolves.not.toThrow();
    expect(
      addTechnology(technology2, Id.makeId(), "LEADER")
    ).resolves.not.toThrow();
    expect(
      previewTechnologies({ teamId, teamRole: "LEADER" })
    ).resolves.toEqual([
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
        Id.makeId(),
        "LEADER"
      )
    ).rejects.toThrow("Failed to add technology.");
  });
});
