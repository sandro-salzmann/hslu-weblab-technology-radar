import faker from "@faker-js/faker";
import { HistoryEvent, TechnologyData } from "common";
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
    published: faker.random.arrayElement([true, false]),
    publishedAt: new Date(faker.time.recent()).toISOString(),
    changedBy: Id.makeId(),
    changedAt: new Date(faker.time.recent()).toISOString(),
  };

  return {
    ...technology,
    ...overrides,
  };
}

export const makeFakeHistoryEvent = (): HistoryEvent => ({
  type: faker.random.arrayElement([
    "published",
    "nameChanged",
    "descriptionChanged",
    "categoryChanged",
    "maturityChanged",
    "maturityDescriptionChanged",
  ]),
  newValue: faker.lorem.word(),
  prevValue: faker.lorem.word(),
});
