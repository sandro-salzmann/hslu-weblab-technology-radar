import { listTechnology, previewTechnologies } from "../use-cases";
import { makeGetTechnologiesPreview } from "./get-technologies-preview";
import { makeGetTechnology } from "./get-technology";

export interface HttpResponse {
  headers: any;
  statusCode: number;
  body: any;
}

const getTechnology = makeGetTechnology({ listTechnology });
const getTechnologiesPreview = makeGetTechnologiesPreview({
  previewTechnologies,
});

export const technologyController = Object.freeze({
  getTechnology,
  getTechnologiesPreview,
});
