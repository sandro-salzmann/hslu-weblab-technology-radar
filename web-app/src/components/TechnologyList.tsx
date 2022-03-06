import { TechnologyPreviewData } from "common";
import React, { Fragment } from "react";
import { List } from "semantic-ui-react";
import { useStore } from "../state-management/store";
import {
  PlaceholderHeaderWithTwoLines,
  PlaceholderThreeLines,
} from "./Placeholders";

interface TechnologyListProps {
  technologyPreviews: TechnologyPreviewData[];
  detailed?: boolean;
  isLoading: boolean;
}

export const TechnologyList = ({
  technologyPreviews,
  detailed = false,
  isLoading,
}: TechnologyListProps) => {
  const setActiveTechnologyId = useStore(
    (state) => state.setActiveTechnologyId
  );
  const activeTechnologyId = useStore((state) => state.activeTechnologyId);

  return (
    <List selection verticalAlign="middle">
      {isLoading ? (
        detailed ? (
          <Fragment>
            <PlaceholderHeaderWithTwoLines />
            <PlaceholderHeaderWithTwoLines />
          </Fragment>
        ) : (
          <PlaceholderThreeLines />
        )
      ) : (
        technologyPreviews.map(({ id, name, descriptionPreview }) => (
          <List.Item
            key={id}
            active={activeTechnologyId === id}
            onClick={() => setActiveTechnologyId(id)}
          >
            <List.Content>
              <List.Header style={detailed ? {} : { fontWeight: 400 }}>
                {name}
              </List.Header>
              {detailed && (
                <List.Content style={{ fontWeight: "400 !IMPORTANT" }}>
                  {descriptionPreview}
                </List.Content>
              )}
            </List.Content>
          </List.Item>
        ))
      )}
    </List>
  );
};
