import {
  BodyContent,
  Container,
  Description,
  Section,
  Timeline,
  YearContent,
} from "@sandro-salzmann/vertical-timeline-component-react";
import { HistoryEvent } from "common";
import React, { Fragment, useState } from "react";
import { Accordion, Header, Icon, Modal } from "semantic-ui-react";
import { useAccountsQuery, useTechnologyHistoryQuery } from "../api/useQueries";
import { PlaceholderFluidHeaderWithTwoLines } from "./Placeholders";

interface TechnologyHistoryProps {
  id?: string;
}

const customTimelineTheme = {
  yearColor: "#405b73",
  lineColor: "#d0cdc4",
  dotColor: "#262626",
  borderDotColor: "#d0cdc4",
  titleColor: "#405b73",
  subtitleColor: "#bf9765",
  textColor: "#262626",
};

export const TechnologyHistory = ({ id }: TechnologyHistoryProps) => {
  const [open, setOpen] = useState(false);

  const onTitleClick = () => setOpen(!open);

  const {
    data: history = [],
    error,
    isLoading,
  } = useTechnologyHistoryQuery(id, open);

  const getStrikeThrough = (text: string, isLink?: boolean) => (
    <span
      style={{
        textDecoration: "line-through",
        textDecorationColor: isLink ? "#4183c4" : "#262626",
      }}
    >
      {text}
    </span>
  );

  const getSimpleTextChange = (
    key: string,
    newValue: string,
    prevValue: string
  ) => (
    <span>
      {key} changed ({getStrikeThrough(prevValue)} ➜ {newValue})
    </span>
  );

  const getLargeTextChange = (
    key: string,
    newValue: string,
    prevValue: string
  ) => (
    <span>
      {key} changed (
      <Modal
        trigger={<a href="#">{getStrikeThrough("Old text", true)}</a>}
        header="View old text"
        content={prevValue}
        actions={[{ key: "done", content: "Close" }]}
      />
      {` ➜ `}
      <Modal
        trigger={<a href="#">New text</a>}
        header="View new text"
        content={newValue}
        actions={[{ key: "done", content: "Close" }]}
      />
      )
    </span>
  );

  const getHistoryEvent = ({ type, newValue, prevValue }: HistoryEvent) => {
    if (type === "published") return "Published";
    if (type === "nameChanged")
      return getSimpleTextChange("Name", newValue, prevValue);
    if (type === "categoryChanged")
      return getSimpleTextChange("Category", newValue, prevValue);
    if (type === "maturityChanged")
      return getSimpleTextChange("Maturity", newValue, prevValue);
    if (type === "descriptionChanged")
      return getLargeTextChange("Description", newValue, prevValue);
    if (type === "maturityDescriptionChanged")
      return getLargeTextChange("Maturity description", newValue, prevValue);

    throw new Error("Received unknown event type: " + type);
  };

  const sortedHistory = history.sort((a, b) =>
    a.timestamp < b.timestamp ? 1 : -1
  );

  const { data: changedByAccounts = [], error: errorLoadingAccounts } =
    useAccountsQuery(sortedHistory.map(({ changedBy }) => changedBy));

  return (
    <Accordion>
      <Accordion.Title active={open} index={0} onClick={onTitleClick}>
        <Icon name="dropdown" />
        <Header style={{ display: "inline" }}>History</Header>
      </Accordion.Title>
      <Accordion.Content active={open}>
        {error ? (
          <span>Failed to get history ({error.message})</span>
        ) : isLoading ? (
          <Fragment>
            <PlaceholderFluidHeaderWithTwoLines />
            <PlaceholderFluidHeaderWithTwoLines />
          </Fragment>
        ) : history.length === 0 ? (
          "This technology hasn't been updated yet."
        ) : (
          <div style={{ marginTop: 7 }}>
            <Timeline theme={customTimelineTheme} dateFormat="short" lang="de">
              {sortedHistory.map(
                ({ changedBy, historyEvents = [], timestamp }) => (
                  <Container>
                    <YearContent startDate={timestamp} />
                    <BodyContent>
                      <Section
                        title={
                          errorLoadingAccounts
                            ? "Error loading account."
                            : changedByAccounts.find(
                                ({ id }) => id === changedBy
                              )?.email || "Loading name..."
                        }
                      >
                        {historyEvents.map((event: HistoryEvent) => (
                          // @ts-ignore text can be a react element
                          <Description text={getHistoryEvent(event)} />
                        ))}
                      </Section>
                    </BodyContent>
                  </Container>
                )
              )}
            </Timeline>
          </div>
        )}
      </Accordion.Content>
    </Accordion>
  );
};
