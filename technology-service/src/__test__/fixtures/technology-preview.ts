import faker from "@faker-js/faker";
import { TechnologyData, TechnologyPreviewData } from "common";
import { Id } from "./id";

export function makeFakeTechnologyPreviewData(
  overrides = {}
): TechnologyPreviewData {
  const technologyPreview: TechnologyPreviewData = {
    id: Id.makeId(),
    category: faker.random.arrayElement([
      "techniques",
      "platforms",
      "tools",
      "languages",
    ]),
    maturity: faker.random.arrayElement(["assess", "trial", "adopt", "hold"]),
    name: faker.lorem.word(),
    descriptionPreview: faker.lorem.paragraphs(3),
  };

  return {
    ...technologyPreview,
    ...overrides,
  };
}

export const makeTechnologyPreviewOf = ({
  category,
  description,
  id,
  maturity,
  name,
}: TechnologyData) => ({
  category,
  descriptionPreview: description.slice(0, 50),
  id,
  maturity,
  name,
});
