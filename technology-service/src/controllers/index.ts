import {
  addTechnology,
  editTechnology,
  listTechnology,
  previewTechnologies,
} from "../use-cases";
import { makeGetTechnologiesPreview } from "./get-technologies-preview";
import { makeGetTechnology } from "./get-technology";
import { makePatchTechnology } from "./patch-technology";
import { makePostTechnology } from "./post-technology";

export interface HttpResponse {
  headers: any;
  statusCode: number;
  body: any;
}

export const getTechnology = makeGetTechnology({ listTechnology });
export const getTechnologiesPreview = makeGetTechnologiesPreview({
  previewTechnologies,
});
export const postTechnology = makePostTechnology({ addTechnology });
export const patchTechnology = makePatchTechnology({ editTechnology });
