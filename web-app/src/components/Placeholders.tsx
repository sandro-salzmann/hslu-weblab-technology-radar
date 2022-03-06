import React from "react";
import { Placeholder } from "semantic-ui-react";

export const PlaceholderThreeLines = () => {
  return (
    <Placeholder>
      <Placeholder.Line />
      <Placeholder.Line />
      <Placeholder.Line />
    </Placeholder>
  );
};

export const PlaceholderHeader = () => {
  return (
    <Placeholder>
      <Placeholder.Header>
        <Placeholder.Line />
      </Placeholder.Header>
    </Placeholder>
  );
};

export const PlaceholderHeaderWithTwoLines = () => {
  return (
    <Placeholder>
      <Placeholder.Header>
        <Placeholder.Line />
      </Placeholder.Header>
      <Placeholder.Line />
      <Placeholder.Line />
    </Placeholder>
  );
};
