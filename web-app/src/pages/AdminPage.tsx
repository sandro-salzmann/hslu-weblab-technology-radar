import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Grid } from "semantic-ui-react";
import { AddTechnologyForm } from "../components/AddTechnologyForm";
import { TechnologiesTable } from "../components/TechnologiesTable";

export const AdminPage = () => {
  const navigate = useNavigate();

  const onBackClick = () => navigate("/");

  return (
    <Fragment>
      <Button
        content="Back"
        onClick={onBackClick}
        icon="arrow left"
        labelPosition="left"
      />
      <Grid stackable columns={2} doubling style={{ marginTop: 7 }}>
        <Grid.Column>
          <Card fluid>
            <Card.Content>
              <Card.Header>Technologie hinzufügen</Card.Header>
              <Card.Description>
                <AddTechnologyForm />
              </Card.Description>
            </Card.Content>
          </Card>
        </Grid.Column>
        <Grid.Column>
          <TechnologiesTable />
        </Grid.Column>
      </Grid>
    </Fragment>
  );
};
