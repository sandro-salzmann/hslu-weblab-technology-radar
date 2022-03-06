import { technologyDb } from "../data-access";
import { buildListTechnology } from "./list-technology";
import { buildPreviewTechnologies } from "./preview-technologies";

export const listTechnology = buildListTechnology({ technologyDb });
export const previewTechnologies = buildPreviewTechnologies({ technologyDb });
