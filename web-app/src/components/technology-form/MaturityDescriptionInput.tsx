import React from "react";
import { Form, FormTextAreaProps } from "semantic-ui-react";

export const MaturityDescriptionInput = (props: FormTextAreaProps) => (
  <Form.TextArea
    label="Beschreibung der Einordnung"
    placeholder="Beschreibung warum die Einordnung gewählt wurde..."
    name="maturityDescription"
    {...props}
  />
);
