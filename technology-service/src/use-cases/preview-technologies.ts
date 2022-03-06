import { TechnologyCategory, TechnologyPreviewData } from "common";
import { TechnologyDb } from "../data-access/technology-db";

interface BuildPreviewTechnologiesFnProps {
  technologyDb: TechnologyDb;
}
interface PreviewTechnologiesFnProps {
  category?: TechnologyCategory;
  teamId: string;
}
type BuildPreviewTechnologiesFn = (
  props: BuildPreviewTechnologiesFnProps
) => PreviewTechnologiesFn;
export type PreviewTechnologiesFn = (
  props: PreviewTechnologiesFnProps
) => Promise<TechnologyPreviewData[]>;

export const buildPreviewTechnologies: BuildPreviewTechnologiesFn =
  ({ technologyDb }) =>
  async ({ category, teamId }) => {
    if (!teamId) {
      throw new Error("You must supply a team id.");
    }
    if (
      category &&
      !["techniques", "platforms", "tools", "languages"].includes(category)
    ) {
      throw new Error("Technology must have a valid category.");
    }

    const technologyPreviews = await technologyDb.previewAll({
      teamId,
      category,
    });

    return technologyPreviews.map((technologyPreview) =>
      technologyPreview.getTechnologyPreviewData()
    );
  };
