import React from "react";
import { Form, FormInputProps } from "semantic-ui-react";

export const NameInput = (props: FormInputProps) => (
  <Form.Input
    fluid
    label="Name"
    placeholder="Name"
    required
    name="name"
    {...props}
  />
);
