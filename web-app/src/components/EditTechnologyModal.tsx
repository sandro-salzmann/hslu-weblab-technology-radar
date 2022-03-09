import { PatchTechnologyBody } from "common";
import React, { useState } from "react";
import {
  Button,
  DropdownProps,
  Form,
  InputOnChangeData,
  Modal,
  TextAreaProps,
} from "semantic-ui-react";
import { usePatchTechnology } from "../api/useMutations";
import { useTechnologyQuery } from "../api/useQueries";
import { useStore } from "../state-management/store";
import { PlaceholderHeader } from "./Placeholders";
import { CategorySelection } from "./technology-form/CategorySelection";
import { DescriptionInput } from "./technology-form/DescriptionInput";
import { MaturityDescriptionInput } from "./technology-form/MaturityDescriptionInput";
import { MaturitySelection } from "./technology-form/MaturitySelection";
import { NameInput } from "./technology-form/NameInput";
import { TechnologyHistory } from "./TechnologyHistory";

type PatchTechnologyBodyKey =
  | "name"
  | "category"
  | "description"
  | "maturity"
  | "maturityDescription";

const defaultValues: PatchTechnologyBody = {
  // @ts-ignore id is never a changed value
  id: undefined,
  name: undefined,
  category: "techniques",
  description: undefined,
  // @ts-ignore to use placeholder in category dropdown
  maturity: undefined,
  maturityDescription: undefined,
};

interface Errors {
  id?: string;
  name?: string;
  category?: string;
  description?: string;
  maturity?: string;
  maturityDescription?: string;
}

export const EditTechnologyModal = () => {
  const activeEditingTechnologyId = useStore(
    (state) => state.activeEditingTechnologyId
  );
  const clearActiveEditingTechnologyId = useStore(
    (state) => state.clearActiveEditingTechnologyId
  );

  const [errors, setErrors] = useState<Errors>();
  const [changedValues, setChangedValues] =
    useState<PatchTechnologyBody>(defaultValues);

  const { mutate, isLoading: isLoadingEditing } = usePatchTechnology({
    onSuccess: () => {
      resetChangedValues();
      close();
    },
  });
  const {
    data: technology,
    error,
    isLoading,
  } = useTechnologyQuery(activeEditingTechnologyId);

  const resetChangedValues = () => {
    // @ts-ignore to reset value
    setChangedValues(defaultValues);
    // @ts-ignore to reset value
    setErrors({});
  };

  const close = () => {
    clearActiveEditingTechnologyId();
    resetChangedValues();
  };

  const onChange = (name: string, value: string) => {
    setChangedValues({ ...changedValues, [name]: value });
    setErrors({ ...errors, [name]: undefined });
  };

  const onChangeInput = (
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => onChange(data.name, data.value);

  const onChangeSelect = (
    event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps
  ) => onChange(data.name, data.value as string);

  const onChangeTextarea = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    data: TextAreaProps
  ) => onChange(data.name, data.value as string);

  let values: PatchTechnologyBody = technology || { id: "" };
  for (const key in changedValues) {
    const value = changedValues[key as PatchTechnologyBodyKey];
    // @ts-ignore values is always of type PatchTechnologyBody
    if (value !== undefined) values[key] = value;
  }

  let {
    maturity,
    name,
    maturityDescription,
    category,
    description,
    published,
  } = values;

  const onSaveClick = () => {
    const missingMaturity = !maturity && published;
    const missingMaturityDescription = !maturityDescription && published;
    const missingName = !name;
    const missingCategory = !category;
    const missingDescription = !description;

    if (
      missingMaturity ||
      missingMaturityDescription ||
      missingName ||
      missingCategory ||
      missingDescription
    ) {
      setErrors({
        maturity: missingMaturity
          ? "Please select a maturity."
          : errors?.maturity,
        maturityDescription: missingMaturityDescription
          ? "Please provide a maturity description."
          : errors?.maturityDescription,
        name: missingName ? "Please provide a name." : errors?.name,
        category: missingCategory
          ? "Please select a category."
          : errors?.category,
        description: missingDescription
          ? "Please provide a description."
          : errors?.description,
      });
    } else if (activeEditingTechnologyId) {
      mutate({ ...changedValues, id: activeEditingTechnologyId });
    }
  };

  return error ? (
    <span>Failed to get technology ({error.message})</span>
  ) : (
    <Modal
      open={!!activeEditingTechnologyId}
      onClose={close}
      // prevent users from closing the modal during loading of editing
      closeOnDimmerClick={!isLoadingEditing}
      closeOnDocumentClick={!isLoadingEditing}
      closeOnEscape={!isLoadingEditing}
    >
      <Modal.Header>
        {isLoading ? <PlaceholderHeader /> : `Editing "${name}"`}
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Form style={{ marginBottom: 14 }}>
            <Form.Group widths="equal">
              <NameInput
                onChange={onChangeInput}
                value={name}
                error={errors?.name}
              />
              <CategorySelection
                onChange={onChangeSelect}
                value={category}
                error={errors?.category}
              />
              <MaturitySelection
                onChange={onChangeSelect}
                value={maturity}
                required={published}
                error={errors?.maturity}
              />
            </Form.Group>
            <DescriptionInput
              onChange={onChangeTextarea}
              value={description}
              style={{ height: 150 }}
              error={errors?.description}
            />
            <MaturityDescriptionInput
              value={maturityDescription}
              onChange={onChangeTextarea}
              style={{ height: 150 }}
              required={published}
              error={errors?.maturityDescription}
            />
          </Form>
          <TechnologyHistory id={activeEditingTechnologyId} />
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content="Cancel"
          onClick={close}
          basic
          negative
          disabled={isLoadingEditing}
        />
        <Button
          content="Save"
          onClick={onSaveClick}
          primary
          disabled={isLoadingEditing || isLoading}
          loading={isLoadingEditing}
        />
      </Modal.Actions>
    </Modal>
  );
};
