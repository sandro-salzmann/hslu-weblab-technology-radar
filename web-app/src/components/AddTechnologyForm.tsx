import { PostTechnologyBody } from "common";
import React, { useState } from "react";
import {
  DropdownProps,
  Form,
  FormProps,
  InputOnChangeData,
  TextAreaProps,
} from "semantic-ui-react";
import { useAddTechnology } from "../api/useMutations";
import { useMessageQueue } from "../hooks/useMessageQueue";
import { CategorySelection } from "./technology-form/CategorySelection";
import { DescriptionInput } from "./technology-form/DescriptionInput";
import { MaturityDescriptionInput } from "./technology-form/MaturityDescriptionInput";
import { MaturitySelection } from "./technology-form/MaturitySelection";
import { NameInput } from "./technology-form/NameInput";

const defaultValues: PostTechnologyBody = {
  name: "",
  category: "techniques",
  description: "",
  // @ts-ignore to use placeholder in category dropdown
  maturity: "",
  maturityDescription: "",
};

export const AddTechnologyForm = () => {
  const { Messages, addMessage } = useMessageQueue();
  const [values, setValues] = useState<PostTechnologyBody>(defaultValues);
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

  const { name, category, description, maturity, maturityDescription } = values;

  return (
    <Form onSubmit={onSubmit}>
      <Form.Group widths="equal">
        <NameInput onChange={onChangeInput} value={name} />
        <CategorySelection onChange={onChangeSelect} value={category} />
        <MaturitySelection onChange={onChangeSelect} value={maturity} />
      </Form.Group>
      <DescriptionInput onChange={onChangeTextarea} value={description} />
      <MaturityDescriptionInput
        value={maturityDescription}
        onChange={onChangeTextarea}
      />
      <Form.Button primary disabled={isLoading} loading={isLoading}>
        Hinzufügen
      </Form.Button>
      {Messages}
    </Form>
  );
};
