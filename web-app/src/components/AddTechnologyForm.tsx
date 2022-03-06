import React, { useState } from "react";
import {
  DropdownProps,
  Form,
  FormProps,
  InputOnChangeData,
  TextAreaProps,
} from "semantic-ui-react";
import { AddTechnologyBody, useAddTechnology } from "../api/useMutations";
import { useMessageQueue } from "../hooks/useMessageQueue";

const categoryOptions = [
  { key: "techniques", text: "Techniques", value: "techniques" },
  { key: "platforms", text: "Platforms", value: "platforms" },
  { key: "tools", text: "Tools", value: "tools" },
  { key: "languages", text: "Languages", value: "languages" },
];

const maturityOptions = [
  { key: "assess", text: "Assess", value: "assess" },
  { key: "trial", text: "Trial", value: "trial" },
  { key: "adopt", text: "Adopt", value: "adopt" },
  { key: "hold", text: "Hold", value: "hold" },
];

const defaultValues: AddTechnologyBody = {
  name: "",
  // @ts-ignore to use placeholder in category dropdown
  category: "",
  description: "",
};

export const AddTechnologyForm = () => {
  const { Messages, addMessage } = useMessageQueue();
  const [values, setValues] = useState<AddTechnologyBody>(defaultValues);
  const { mutate, isLoading } = useAddTechnology({
    addMessage,
    onSuccess: () => setValues(defaultValues),
  });

  const onChangeInput = (
    event: React.ChangeEvent<HTMLInputElement>,
    data: InputOnChangeData
  ) => setValues({ ...values, [data.name]: data.value });

  const onChangeSelect = (
    event: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps
  ) => setValues({ ...values, [data.name]: data.value });

  const onChangeTextarea = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
    data: TextAreaProps
  ) => setValues({ ...values, [data.name]: data.value });

  const onSubmit = async (
    _e: React.FormEvent<HTMLFormElement>,
    _data: FormProps
  ) => mutate(values);

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group widths="equal">
        <Form.Input
          fluid
          label="Name"
          placeholder="Name"
          required
          name="name"
          onChange={onChangeInput}
        />
        <Form.Select
          fluid
          label="Kategorie"
          options={categoryOptions}
          placeholder="Kategorie"
          required
          clearable
          name="category"
          onChange={onChangeSelect}
        />
        <Form.Select
          fluid
          label="Ring"
          options={maturityOptions}
          placeholder="Ring"
          clearable
          name="maturity"
          onChange={onChangeSelect}
        />
      </Form.Group>
      <Form.TextArea
        label="Beschreibung Technologie"
        placeholder="Beschreibung was die Technologie macht..."
        required
        name="description"
        onChange={onChangeTextarea}
      />
      <Form.TextArea
        label="Beschreibung der Einordnung"
        placeholder="Beschreibung warum die Einordnung gewählt wurde..."
        name="maturityDescription"
        onChange={onChangeTextarea}
      />
      <Form.Button primary disabled={isLoading} loading={isLoading}>
        Hinzufügen
      </Form.Button>
      {Messages}
    </Form>
  );
};
