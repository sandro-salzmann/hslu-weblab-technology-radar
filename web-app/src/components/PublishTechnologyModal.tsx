import { TechnologyMaturity } from "common";
import React, { useState } from "react";
import {
  Button,
  DropdownProps,
  Form,
  Modal,
  TextAreaProps,
} from "semantic-ui-react";
import { usePatchTechnology } from "../api/useMutations";
import { useTechnologyQuery } from "../api/useQueries";
import { useStore } from "../state-management/store";
import { PlaceholderHeader } from "./Placeholders";
import { MaturityDescriptionInput } from "./technology-form/MaturityDescriptionInput";
import { MaturitySelection } from "./technology-form/MaturitySelection";

export const PublishTechnologyModal = () => {
  const activePublishingTechnologyId = useStore(
    (state) => state.activePublishingTechnologyId
  );
  const clearActivePublishingTechnologyId = useStore(
    (state) => state.clearActivePublishingTechnologyId
  );

  const [changedMaturity, setChangedMaturity] = useState<TechnologyMaturity>();
  const [changedMaturityDescription, setChangedMaturityDescription] =
    useState<string>();
  const [maturityError, setMaturityError] = useState<string>();
  const [maturityDescriptionError, setMaturityDescriptionError] =
    useState<string>();

  const {
    data: technology,
    error,
    isLoading,
  } = useTechnologyQuery(activePublishingTechnologyId);
  let { maturity, name, maturityDescription } = technology || {};

  const currentMaturityDescription =
    changedMaturityDescription !== undefined
      ? changedMaturityDescription
      : maturityDescription;
  const currentMaturity =
    changedMaturity !== undefined ? changedMaturity : maturity;

  const resetChangedValues = () => {
    // @ts-ignore to reset value
    setChangedMaturity();
    // @ts-ignore to reset value
    setChangedMaturityDescription();
  };

  const close = () => {
    clearActivePublishingTechnologyId();
    resetChangedValues();
  };

  const onChangeMaturity = (
    event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps
  ) => {
    // @ts-ignore to reset error
    if (data.value) setMaturityError();
    setChangedMaturity(data.value as TechnologyMaturity);
  };

  const onChangeMaturityDescription = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    data: TextAreaProps
  ) => {
    // @ts-ignore to reset error
    if (data.value) setMaturityDescriptionError();
    setChangedMaturityDescription(data.value as string);
  };

  const { mutate: publish, isLoading: isPublishing } = usePatchTechnology({
    onSuccess: close,
  });

  const onPublishClick = () => {
    if (!currentMaturity) setMaturityError("Please select a maturity.");
    if (!currentMaturityDescription)
      setMaturityDescriptionError("Please provide a description.");
    if (
      currentMaturity &&
      currentMaturityDescription &&
      activePublishingTechnologyId
    ) {
      publish({
        id: activePublishingTechnologyId,
        published: true,
        // only send maturity and maturityDescription if they have been changed
        maturity: changedMaturity,
        maturityDescription: changedMaturityDescription,
      });
    }
  };

  return error ? (
    <span>Failed to get technology ({error.message})</span>
  ) : (
    <Modal
      open={!!activePublishingTechnologyId}
      onClose={close}
      // prevent users from closing the modal during loading of publishing
      closeOnDimmerClick={!isPublishing}
      closeOnDocumentClick={!isPublishing}
      closeOnEscape={!isPublishing}
    >
      <Modal.Header>
        {isLoading ? <PlaceholderHeader /> : `Publishing "${name}"`}
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Form>
            <Form.Group>
              <MaturitySelection
                onChange={onChangeMaturity}
                value={currentMaturity}
                loading={isLoading}
                required={true}
                width={4}
                error={maturityError}
              />
              <MaturityDescriptionInput
                value={currentMaturityDescription}
                onChange={onChangeMaturityDescription}
                required={true}
                style={{ height: 200 }}
                width={12}
                error={maturityDescriptionError}
              />
            </Form.Group>
          </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content="Cancel"
          onClick={close}
          basic
          negative
          disabled={isPublishing}
        />
        <Button
          content="Publish"
          onClick={onPublishClick}
          primary
          disabled={isPublishing}
          loading={isPublishing}
        />
      </Modal.Actions>
    </Modal>
  );
};
