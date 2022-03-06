import { TechnologyCategory, TechnologyPreviewData } from "common";
import React from "react";
import { Grid } from "semantic-ui-react";
import { useTechnologyPreviewsQuery } from "../api/useQueries";
import { CategoryCard } from "../components/CategoryCard";

export const ViewerPage = () => {
  const {
    data: technologyPreviews = [],
    error,
    isLoading,
  } = useTechnologyPreviewsQuery();

  const techniqueTechnologyPreviews = technologyPreviews.filter(
    ({ category }) => category === "techniques"
  );
  const platformTechnologyPreviews = technologyPreviews.filter(
    ({ category }) => category === "platforms"
  );
  const toolTechnologyPreviews = technologyPreviews.filter(
    ({ category }) => category === "tools"
  );
  const languageTechnologyPreviews = technologyPreviews.filter(
    ({ category }) => category === "languages"
  );

  const categoryCards: {
    category: TechnologyCategory;
    technologyPreviews: TechnologyPreviewData[];
  }[] = [
    { category: "techniques", technologyPreviews: techniqueTechnologyPreviews },
    { category: "platforms", technologyPreviews: platformTechnologyPreviews },
    { category: "tools", technologyPreviews: toolTechnologyPreviews },
    { category: "languages", technologyPreviews: languageTechnologyPreviews },
  ];

  return error ? (
    `Failed to get technologies (${error.message})`
  ) : (
    <Grid stackable columns={2}>
      {categoryCards.map((cardData) => (
        <Grid.Column key={cardData.category}>
          <CategoryCard {...cardData} isLoading={isLoading} />
        </Grid.Column>
      ))}
    </Grid>
  );
};
