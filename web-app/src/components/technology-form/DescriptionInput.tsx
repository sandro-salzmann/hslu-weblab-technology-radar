import React from "react";
import { Form, FormTextAreaProps } from "semantic-ui-react";

export const DescriptionInput = (props: FormTextAreaProps) => (
  <Form.TextArea
    label="Beschreibung Technologie"
    placeholder="Beschreibung was die Technologie macht..."
    name="description"
    required
    {...props}
  />
);
