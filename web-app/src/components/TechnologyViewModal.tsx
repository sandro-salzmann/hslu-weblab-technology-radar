import React, { Fragment } from "react";
import { Button, Header, Modal } from "semantic-ui-react";
import { useGetTechnology } from "../api/useApi";
import { useStore } from "../state-management/store";
import { toCapitalize } from "../utils/toCapitalize";
import {
  PlaceholderHeader,
  PlaceholderHeaderWithTwoLines,
  PlaceholderThreeLines,
} from "./Placeholders";

interface TechnologyViewModalProps {
  id: string;
}

export const TechnologyViewModal = () => {
  const clearActiveTechnologyId = useStore(
    (state) => state.clearActiveTechnologyId
  );
  const activeTechnologyId = useStore((state) => state.activeTechnologyId);
  const { technology, isLoading } = useGetTechnology(activeTechnologyId);

  let { category, maturity, name, description, descriptionClassification } =
    technology;

  const close = () => clearActiveTechnologyId();

  return (
    <Modal onClose={close} open={!!activeTechnologyId} size="small" closeIcon>
      <Modal.Header>
        {isLoading ? (
          <PlaceholderHeader />
        ) : (
          `${name} (${toCapitalize(category)})`
        )}
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          {isLoading ? <PlaceholderThreeLines /> : <p>{description}</p>}
          {isLoading ? (
            <PlaceholderHeaderWithTwoLines />
          ) : (
            <Fragment>
              <Header>{toCapitalize(maturity)}</Header>
              <p>{descriptionClassification}</p>
            </Fragment>
          )}
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button content="Close" onClick={close} primary />
      </Modal.Actions>
    </Modal>
  );
};
