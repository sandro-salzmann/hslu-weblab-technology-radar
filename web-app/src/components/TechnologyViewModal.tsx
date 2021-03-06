import React, { Fragment } from "react";
import { Button, Header, Modal } from "semantic-ui-react";
import { usePermissionsQuery, useTechnologyQuery } from "../api/useQueries";
import { useStore } from "../state-management/store";
import { toCapitalize } from "../utils/toCapitalize";
import {
  PlaceholderHeader,
  PlaceholderHeaderWithTwoLines,
  PlaceholderThreeLines,
} from "./Placeholders";
import { TechnologyHistory } from "./TechnologyHistory";

export const TechnologyViewModal = () => {
  const clearActiveTechnologyId = useStore(
    (state) => state.clearActiveTechnologyId
  );
  const activeTechnologyId = useStore((state) => state.activeTechnologyId);
  const {
    data: technology,
    error,
    isLoading,
  } = useTechnologyQuery(activeTechnologyId);

  const { data: permissions } = usePermissionsQuery();

  let {
    id,
    category = "",
    maturity = "",
    name,
    description,
    maturityDescription,
  } = technology || {};

  const setActiveEditingTechnologyId = useStore(
    (state) => state.setActiveEditingTechnologyId
  );

  const close = () => clearActiveTechnologyId();

  const onChangeClick = () => {
    if (id) setActiveEditingTechnologyId(id);
  };

  return error ? (
    <span>Failed to get technology ({error.message})</span>
  ) : (
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
              <p>{maturityDescription}</p>
            </Fragment>
          )}
          <TechnologyHistory id={activeTechnologyId} />
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        {permissions?.teamRole === "LEADER" && (
          <Button content="Edit" secondary onClick={onChangeClick} />
        )}
        <Button content="Close" onClick={close} primary />
      </Modal.Actions>
    </Modal>
  );
};
