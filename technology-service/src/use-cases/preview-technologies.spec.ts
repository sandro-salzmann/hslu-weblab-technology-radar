import { makeTechnologyDb } from "../data-access/technology-db";
import { Id } from "../Id";
import {
  insertTechnology,
  makeDb,
  restoreBackup,
} from "../__test__/fixtures/db";
import { makeFakeTechnologyData } from "../__test__/fixtures/technology";
import { makeTechnologyPreviewOf } from "../__test__/fixtures/technology-preview";
import {
  buildPreviewTechnologies,
  PreviewTechnologiesFn,
} from "./preview-technologies";

describe("preview technologies", () => {
  let previewTechnology: PreviewTechnologiesFn;

  beforeAll(async () => {
    const technologyDb = makeTechnologyDb({ makeDb });
    previewTechnology = buildPreviewTechnologies({ technologyDb });
  });

  beforeEach(async () => {
    restoreBackup();
  });

  it("requires a team id", () => {
    expect(previewTechnology({ teamId: "" })).rejects.toThrow(
      "You must supply a team id."
    );
  });

  it("can have a valid category", () => {
    expect(
      // @ts-ignore: Testing invalid category
      previewTechnology({ teamId: Id.makeId(), category: "invalid" })
    ).rejects.toThrow("Technology must have a valid category.");
    expect(previewTechnology({ teamId: Id.makeId(), category: "tools" }))
      .resolves;
  });

  const insertExampleTechnologies = async () => {
    const firstTechnology = makeFakeTechnologyData({ category: "tools" });
    const secondTechnology = makeFakeTechnologyData({ category: "platforms" });
    const thirdTechnology = makeFakeTechnologyData({ category: "tools" });
    const firstTechnologyPreview = makeTechnologyPreviewOf(firstTechnology);
    const secondTechnologyPreview = makeTechnologyPreviewOf(secondTechnology);
    const thirdTechnologyPreview = makeTechnologyPreviewOf(thirdTechnology);

    const teamId = Id.makeId();

    await insertTechnology(firstTechnology, teamId);
    await insertTechnology(secondTechnology, teamId);
    await insertTechnology(thirdTechnology, teamId);
    await insertTechnology(makeFakeTechnologyData(), Id.makeId());
    await insertTechnology(makeFakeTechnologyData(), Id.makeId());

    return {
      teamId,
      firstTechnologyPreview,
      secondTechnologyPreview,
      thirdTechnologyPreview,
    };
  };

  it("gets technologies by team id", async () => {
    const {
      teamId,
      firstTechnologyPreview,
      secondTechnologyPreview,
      thirdTechnologyPreview,
    } = await insertExampleTechnologies();

    expect(await previewTechnology({ teamId })).toEqual([
      firstTechnologyPreview,
      secondTechnologyPreview,
      thirdTechnologyPreview,
    ]);
  });

  it("gets technologies by team id within category", async () => {
    const { teamId, firstTechnologyPreview, thirdTechnologyPreview } =
      await insertExampleTechnologies();

    expect(await previewTechnology({ teamId, category: "tools" })).toEqual([
      firstTechnologyPreview,
      thirdTechnologyPreview,
    ]);
  });
});
