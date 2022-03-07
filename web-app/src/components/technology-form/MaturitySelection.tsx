import React from "react";
import { Form, FormSelectProps } from "semantic-ui-react";

const maturityOptions = [
  { key: "assess", text: "Assess", value: "assess" },
  { key: "trial", text: "Trial", value: "trial" },
  { key: "adopt", text: "Adopt", value: "adopt" },
  { key: "hold", text: "Hold", value: "hold" },
];

// remove required options key from FormSelectProps interface because the options are defined here
type FormSelectPropsWithoutOptions = Pick<
  FormSelectProps,
  Exclude<keyof FormSelectProps, "options">
>;

export const MaturitySelection = (props: FormSelectPropsWithoutOptions) => (
  <Form.Select
    fluid
    label="Ring"
    placeholder="Ring"
    clearable
    name="maturity"
    {...props}
    options={maturityOptions}
  />
);
