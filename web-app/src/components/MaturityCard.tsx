import { TechnologyMaturity, TechnologyPreviewData } from "common";
import { Card } from "semantic-ui-react";
import { toCapitalize } from "../utils/toCapitalize";
import { TechnologyList } from "./TechnologyList";

interface MaturityCardProps {
  maturity: TechnologyMaturity;
  technologyPreviews: TechnologyPreviewData[];
  isLoading: boolean;
}

export const MaturityCard = ({
  maturity,
  technologyPreviews,
  isLoading,
}: MaturityCardProps) => {
  return (
    <Card fluid>
      <Card.Content>
        <Card.Header>
          <span>{toCapitalize(maturity)}</span>
        </Card.Header>
        <Card.Description>
          {!isLoading && technologyPreviews.length === 0 ? (
            "Change a technology maturity to '" +
            toCapitalize(maturity) +
            "' to make it appear here."
          ) : (
            <TechnologyList
              detailed={true}
              technologyPreviews={technologyPreviews}
              isLoading={isLoading}
            />
          )}
        </Card.Description>
      </Card.Content>
    </Card>
  );
};
