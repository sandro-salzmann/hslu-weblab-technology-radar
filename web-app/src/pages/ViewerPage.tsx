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

  const publishedTechnologyPreviews = technologyPreviews.filter(
    ({ published }) => published
  );

  const techniqueTechnologyPreviews = publishedTechnologyPreviews.filter(
    ({ category }) => category === "techniques"
  );
  const platformTechnologyPreviews = publishedTechnologyPreviews.filter(
    ({ category }) => category === "platforms"
  );
  const toolTechnologyPreviews = publishedTechnologyPreviews.filter(
    ({ category }) => category === "tools"
  );
  const languageTechnologyPreviews = publishedTechnologyPreviews.filter(
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
    <span>Failed to get technologies ({error.message})</span>
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
