import { TechnologyPreviewData } from "common";
import React from "react";
import { Table } from "semantic-ui-react";

type TechnologiesTableRowProps = TechnologyPreviewData & {
  onPublishClick: (id: string) => void;
  onEditClick: (id: string) => void;
};

export const TechnologiesTableRow = ({
  category,
  id,
  maturity,
  name,
  published,
  onPublishClick,
  onEditClick,
}: TechnologiesTableRowProps) => {
  const publishedProps = published
    ? { positive: true, content: "Yes" }
    : { warning: true, content: "No" };

  return (
    <Table.Row key={id}>
      <Table.Cell {...publishedProps} textAlign="center" />
      <Table.Cell>{category}</Table.Cell>
      <Table.Cell>{maturity}</Table.Cell>
      <Table.Cell>{name}</Table.Cell>
      <Table.Cell
        textAlign="center"
        colSpan={published ? 2 : 1}
        selectable
        onClick={() => onEditClick(id)}
      >
        <a href="#">Edit</a>
      </Table.Cell>
      {!published && (
        <Table.Cell
          textAlign="center"
          selectable
          onClick={() => onPublishClick(id)}
        >
          <a href="#">Publish</a>
        </Table.Cell>
      )}
    </Table.Row>
  );
};
