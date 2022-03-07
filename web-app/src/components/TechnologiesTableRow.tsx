import { TechnologyPreviewData } from "common";
import React from "react";
import { Button, Table } from "semantic-ui-react";

type TechnologiesTableRowProps = TechnologyPreviewData & {
  onPublishClick: (id: string) => void;
};

export const TechnologiesTableRow = ({
  category,
  id,
  maturity,
  name,
  published,
  onPublishClick,
}: TechnologiesTableRowProps) => {
  return (
    <Table.Row key={id}>
      <Table.Cell>{published ? "Yes" : "No"}</Table.Cell>
      <Table.Cell>{category}</Table.Cell>
      <Table.Cell>{maturity}</Table.Cell>
      <Table.Cell>{name}</Table.Cell>
      <Table.Cell>
        {!published && (
          <Button onClick={() => onPublishClick(id)}>Publish</Button>
        )}
      </Table.Cell>
    </Table.Row>
  );
};
