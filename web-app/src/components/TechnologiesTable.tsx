import React from "react";
import { Table } from "semantic-ui-react";
import { useTechnologyPreviewsQuery } from "../api/useQueries";
import { useStore } from "../state-management/store";
import { PlaceholderTableCell } from "./Placeholders";
import { TechnologiesTableRow } from "./TechnologiesTableRow";

export const TechnologiesTable = () => {
  const { data = [], error, isLoading } = useTechnologyPreviewsQuery();
  const setActivePublishingTechnologyId = useStore(
    (state) => state.setActivePublishingTechnologyId
  );
  const setActiveEditingTechnologyId = useStore(
    (state) => state.setActiveEditingTechnologyId
  );

  return error ? (
    <span>Failed to get technologies ({error.message})</span>
  ) : (
    <Table compact celled unstackable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell width={1}>Published</Table.HeaderCell>
          <Table.HeaderCell width={2}>Category</Table.HeaderCell>
          <Table.HeaderCell width={1}>Maturity</Table.HeaderCell>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell colSpan={2} width={3}>
            Actions
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {isLoading
          ? [1, 2, 3, 4, 5].map((i) => (
              <Table.Row key={`${i}_TechnologiesTable_Row`}>
                {[1, 2, 3, 4, 5].map((j) => (
                  <PlaceholderTableCell
                    key={`${i}_${j}_TechnologiesTable_Cell`}
                  />
                ))}
              </Table.Row>
            ))
          : data
              .sort((a, b) => (a.id < b.id ? 1 : -1))
              .map((props) => (
                <TechnologiesTableRow
                  onEditClick={setActiveEditingTechnologyId}
                  onPublishClick={setActivePublishingTechnologyId}
                  {...props}
                />
              ))}
      </Table.Body>
    </Table>
  );
};
