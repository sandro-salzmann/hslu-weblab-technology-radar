import React from "react";
import { Table } from "semantic-ui-react";
import { useTechnologyPreviewsQuery } from "../api/useQueries";
import { PlaceholderTableCell } from "./Placeholders";

export const TechnologiesTable = () => {
  const { data = [], error, isLoading } = useTechnologyPreviewsQuery();

  return error ? (
    <span>Failed to get technologies ({error.message})</span>
  ) : (
    <Table compact celled unstackable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell width={3}>Category</Table.HeaderCell>
          <Table.HeaderCell width={3}>Maturity</Table.HeaderCell>
          <Table.HeaderCell>Name</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {isLoading
          ? [1, 2, 3, 4, 5].map((i) => (
              <Table.Row key={`${i}_TechnologiesTable_Row`}>
                {[1, 2, 3].map((j) => (
                  <PlaceholderTableCell
                    key={`${i}_${j}_TechnologiesTable_Cell`}
                  />
                ))}
              </Table.Row>
            ))
          : data.map(({ category, id, maturity, name }) => (
              <Table.Row key={id}>
                <Table.Cell>{category}</Table.Cell>
                <Table.Cell>{maturity}</Table.Cell>
                <Table.Cell>{name}</Table.Cell>
              </Table.Row>
            ))}
      </Table.Body>
    </Table>
  );
};
