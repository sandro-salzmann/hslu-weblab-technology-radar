import React from "react";
import { Dropdown, DropdownProps } from "semantic-ui-react";
import { TechnologyCategory } from "../typings/technology";

interface CategorySelectionProps {
  value: TechnologyCategory;
  onChange: (value: string) => void;
}

export const CategorySelection = ({
  value,
  onChange,
}: CategorySelectionProps) => {
  const categorySelectionOptions: {
    key: TechnologyCategory;
    value: TechnologyCategory;
    text: string;
  }[] = [
    {
      key: "techniques",
      value: "techniques",
      text: "Technique",
    },
    {
      key: "platforms",
      value: "platforms",
      text: "Platform",
    },
    {
      key: "tools",
      value: "tools",
      text: "Tool",
    },
    {
      key: "languages",
      value: "languages",
      text: "Language",
    },
  ];

  const onDropdownChange = (
    _e: React.SyntheticEvent<HTMLElement, Event>,
    data: DropdownProps
  ) => {
    if (data && data.value && typeof data.value === "string") {
      onChange(data.value);
    }
  };

  return (
    <Dropdown
      selection
      options={categorySelectionOptions}
      value={value}
      onChange={onDropdownChange}
    />
  );
};
