import { technologyDb } from "../data-access";
import { buildAddTechnology } from "./add-technology";
import { buildEditTechnology } from "./edit-technology";
import { buildListTechnology } from "./list-technology";
import { buildListTechnologyHistory } from "./list-technology-history";
import { buildPreviewTechnologies } from "./preview-technologies";

export const listTechnology = buildListTechnology({ technologyDb });
export const previewTechnologies = buildPreviewTechnologies({ technologyDb });
export const addTechnology = buildAddTechnology({ technologyDb });
export const editTechnology = buildEditTechnology({ technologyDb });
export const listTechnologyHistory = buildListTechnologyHistory({
  technologyDb,
});
