import { TechnologyCategory, TechnologyPreviewData } from "common";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Grid, Header } from "semantic-ui-react";
import { toCapitalize } from "../utils/toCapitalize";
import { TechnologyList } from "./TechnologyList";

interface CategoryCardProps {
  category: TechnologyCategory;
  technologyPreviews: TechnologyPreviewData[];
  isLoading: boolean;
}

export const CategoryCard = ({
  category,
  technologyPreviews,
  isLoading,
}: CategoryCardProps) => {
  const navigate = useNavigate();

  const onExpandClick = () => navigate(category.toLowerCase());

  return (
    <Card fluid>
      <Card.Content>
        <Card.Header>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{toCapitalize(category)}</span>
            <Button
              basic
              icon="expand arrows alternate"
              onClick={onExpandClick}
            />
          </div>
        </Card.Header>
        <Card.Description style={{ marginTop: 21, marginBottom: 14 }}>
          <Grid columns={4} divided>
            {[
              {
                name: "Assess",
                technologyPreviews: technologyPreviews.filter(
                  ({ maturity }) => maturity === "assess"
                ),
              },
              {
                name: "Trial",
                technologyPreviews: technologyPreviews.filter(
                  ({ maturity }) => maturity === "trial"
                ),
              },
              {
                name: "Adopt",
                technologyPreviews: technologyPreviews.filter(
                  ({ maturity }) => maturity === "adopt"
                ),
              },
              {
                name: "Hold",
                technologyPreviews: technologyPreviews.filter(
                  ({ maturity }) => maturity === "hold"
                ),
              },
            ].map(({ name, technologyPreviews }) => (
              <Grid.Column key={name}>
                <Header size="medium" style={{ textAlign: "center" }}>
                  {name}
                </Header>
                <TechnologyList
                  technologyPreviews={technologyPreviews}
                  isLoading={isLoading}
                />
              </Grid.Column>
            ))}
          </Grid>
        </Card.Description>
      </Card.Content>
    </Card>
  );
};
