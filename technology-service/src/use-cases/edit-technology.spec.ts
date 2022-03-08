import { makeTechnologyDb } from "../data-access/technology-db";
import { Id } from "../Id";
import {
  insertTechnology,
  makeDb,
  restoreBackup,
} from "../__test__/fixtures/db";
import { makeFakeTechnologyData } from "../__test__/fixtures/technology";
import { makeTechnologyPreviewOf } from "../__test__/fixtures/technology-preview";
import { buildEditTechnology, EditTechnologyFn } from "./edit-technology";
import { buildPreviewTechnologies } from "./preview-technologies";

describe("edit technology", () => {
  let editTechnology: EditTechnologyFn;

  beforeAll(async () => {
    const technologyDb = makeTechnologyDb({ makeDb });
    editTechnology = buildEditTechnology({ technologyDb });
  });

  beforeEach(async () => {
    restoreBackup();
  });

  it("requires a valid accountId", () => {
    expect(
      editTechnology(makeFakeTechnologyData(), "invalid", "LEADER")
    ).rejects.toThrow("You must supply a accountId");
  });
  it("requires a valid technology id", () => {
    expect(
      editTechnology(
        makeFakeTechnologyData({ id: "invalid" }),
        Id.makeId(),
        "LEADER"
      )
    ).rejects.toThrow("You must supply a valid technology id");
  });
  it("requires a leader role", () => {
    expect(
      editTechnology(makeFakeTechnologyData(), Id.makeId(), "MEMBER")
    ).rejects.toThrow("You don't have permissions to edit technologies.");
  });
  xit("can edit a technology", async () => {
    const technologyDb = makeTechnologyDb({ makeDb });

    const teamId = Id.makeId();
    const existingTechnology = makeFakeTechnologyData({
      teamId,
      published: false,
    });
    const existingTechnology2 = makeFakeTechnologyData({
      teamId,
      published: false,
    });
    await insertTechnology(makeFakeTechnologyData({ teamId: Id.makeId() }));
    await insertTechnology(existingTechnology2);
    await insertTechnology(existingTechnology);
    await insertTechnology(makeFakeTechnologyData({ teamId: Id.makeId() }));

    expect(
      editTechnology(
        { ...existingTechnology, name: "new-name" },
        Id.makeId(),
        "LEADER"
      )
    ).resolves.not.toThrow();
    expect(
      editTechnology(
        { ...existingTechnology2, name: "new-name-2" },
        Id.makeId(),
        "LEADER"
      )
    ).resolves.not.toThrow();

    const previewTechnologies = buildPreviewTechnologies({ technologyDb });
    expect(
      previewTechnologies({ teamId, teamRole: "LEADER" })
    ).resolves.toEqual([
      makeTechnologyPreviewOf({ ...existingTechnology2, name: "new-name-2" }),
      makeTechnologyPreviewOf({ ...existingTechnology, name: "new-name" }),
    ]);
  });
  it("can't edit a technology that doesn't exist", async () => {
    const teamId = Id.makeId();
    const existingTechnology = makeFakeTechnologyData({
      teamId,
      published: false,
    });
    await insertTechnology(existingTechnology);

    expect(
      editTechnology(
        makeFakeTechnologyData({ teamId, id: Id.makeId() }),
        Id.makeId(),
        "LEADER"
      )
    ).rejects.toThrow("Failed to find technology.");
  });
  it("can't edit a technology from another team", async () => {
    const teamId = Id.makeId();
    const existingTechnology = makeFakeTechnologyData({
      teamId,
      published: false,
    });
    await insertTechnology(existingTechnology);
    const otherTeamId = Id.makeId();
    const otherExistingTechnology = makeFakeTechnologyData({
      teamId: otherTeamId,
    });
    await insertTechnology(otherExistingTechnology);

    expect(
      editTechnology(
        makeFakeTechnologyData({ teamId, id: otherExistingTechnology.id }),
        Id.makeId(),
        "LEADER"
      )
    ).rejects.toThrow("Failed to find technology.");
  });
});
