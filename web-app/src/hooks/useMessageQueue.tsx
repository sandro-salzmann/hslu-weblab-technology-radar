import React, { useState } from "react";
import { Message, MessageProps } from "semantic-ui-react";
import { v4 as uuidv4 } from "uuid";

type StoredMessage = MessageProps & { id: string };

export const useMessageQueue = () => {
  const [messages, setMessages] = useState<StoredMessage[]>([]);

  const getRemoveMessageHandler = (messageId: string) => () =>
    setMessages(messages.filter(({ id }) => id !== messageId));

  const addMessage = (message: MessageProps) => {
    setMessages([{ id: uuidv4(), ...message }, ...messages]);
  };

  const Messages = messages.map((message) => (
    <Message onDismiss={getRemoveMessageHandler(message.id)} {...message} />
  ));

  return { Messages, addMessage };
};
