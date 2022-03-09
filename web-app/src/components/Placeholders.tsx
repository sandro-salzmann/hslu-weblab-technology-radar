import React from "react";
import { Placeholder, Table } from "semantic-ui-react";

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

export const PlaceholderLine = () => {
  return (
    <Placeholder>
      <Placeholder.Line />
    </Placeholder>
  );
};

export const PlaceholderTableCell = () => {
  return (
    <Table.Cell>
      <Placeholder>
        <Placeholder.Line style={{ height: 0, margin: "20px 0px" }} />
      </Placeholder>
    </Table.Cell>
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

export const PlaceholderFluidHeaderWithTwoLines = () => {
  return (
    <Placeholder fluid>
      <Placeholder.Header>
        <Placeholder.Line />
      </Placeholder.Header>
      <Placeholder.Line />
      <Placeholder.Line />
      <Placeholder.Line />
      <Placeholder.Line />
    </Placeholder>
  );
};
