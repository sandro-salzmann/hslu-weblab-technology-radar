import React, { Fragment } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Grid } from "semantic-ui-react";
import { useGetTechnologyPreviews } from "../api/useApi";
import { CategorySelection } from "../components/CategorySelection";
import { MaturityCard } from "../components/MaturityCard";
import {
  TechnologyCategory,
  TechnologyMaturity,
  TechnologyPreview,
} from "../typings/technology";

interface CategoryPageProps {
  category: TechnologyCategory;
}

export const CategoryPage = ({ category }: CategoryPageProps) => {
  const { technologyPreviews, isLoading } = useGetTechnologyPreviews(category);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const onBackClick = () => navigate("/");

  const onCategoryChange = (value: string) => {
    navigate("/" + value.toLowerCase());
  };

  const assessTechnologyPreviews = technologyPreviews.filter(
    ({ maturity }) => maturity === "assess"
  );
  const trialTechnologyPreviews = technologyPreviews.filter(
    ({ maturity }) => maturity === "trial"
  );
  const adoptTechnologyPreviews = technologyPreviews.filter(
    ({ maturity }) => maturity === "adopt"
  );
  const holdTechnologyPreviews = technologyPreviews.filter(
    ({ maturity }) => maturity === "hold"
  );

  const maturityCards: {
    maturity: TechnologyMaturity;
    technologyPreviews: TechnologyPreview[];
  }[] = [
    {
      maturity: "assess",
      technologyPreviews: assessTechnologyPreviews,
    },
    {
      maturity: "trial",
      technologyPreviews: trialTechnologyPreviews,
    },
    {
      maturity: "adopt",
      technologyPreviews: adoptTechnologyPreviews,
    },
    {
      maturity: "hold",
      technologyPreviews: holdTechnologyPreviews,
    },
  ];

  return (
    <Fragment>
      <Button
        style={{ float: "left", position: "fixed" }}
        content="Back"
        onClick={onBackClick}
        icon="arrow left"
        labelPosition="left"
      />
      <div style={{ textAlign: "center" }}>
        <CategorySelection
          value={pathname.slice(1) as TechnologyCategory}
          onChange={onCategoryChange}
        />
      </div>
      <Grid stackable columns={4} doubling style={{ marginTop: 7 }}>
        {maturityCards.map((maturityCard) => (
          <Grid.Column key={maturityCard.maturity}>
            <MaturityCard {...maturityCard} isLoading={isLoading} />
          </Grid.Column>
        ))}
      </Grid>
    </Fragment>
  );
};
