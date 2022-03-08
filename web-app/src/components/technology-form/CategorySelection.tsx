import React from "react";
import { Form, FormSelectProps } from "semantic-ui-react";

const categoryOptions = [
  { key: "techniques", text: "Techniques", value: "techniques" },
  { key: "platforms", text: "Platforms", value: "platforms" },
  { key: "tools", text: "Tools", value: "tools" },
  { key: "languages", text: "Languages", value: "languages" },
];

// remove required options key from FormSelectProps interface because the options are defined here
type FormSelectPropsWithoutOptions = Pick<
  FormSelectProps,
  Exclude<keyof FormSelectProps, "options">
>;

export const CategorySelection = (props: FormSelectPropsWithoutOptions) => (
  <Form.Select
    fluid
    label="Kategorie"
    placeholder="Kategorie"
    required
    clearable
    name="category"
    {...props}
    options={categoryOptions}
  />
);
