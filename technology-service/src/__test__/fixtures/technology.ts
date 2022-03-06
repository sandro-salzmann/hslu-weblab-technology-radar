import faker from "@faker-js/faker";
import { TechnologyData } from "common";
import { Id } from "./id";

export function makeFakeTechnologyData(overrides = {}): TechnologyData {
  const technology: TechnologyData = {
    id: Id.makeId(),
    category: faker.random.arrayElement([
      "techniques",
      "platforms",
      "tools",
      "languages",
    ]),
    maturity: faker.random.arrayElement(["assess", "trial", "adopt", "hold"]),
    name: faker.lorem.word(),
    description: faker.lorem.paragraphs(3),
    maturityDescription: faker.lorem.paragraphs(2),
    teamId: Id.makeId(),
  };

  return {
    ...technology,
    ...overrides,
  };
}
