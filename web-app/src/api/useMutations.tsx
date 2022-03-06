import { PostTechnologyBody } from "common";
import { useMutation, useQueryClient } from "react-query";
import { MessageProps } from "semantic-ui-react";
import { useAuthFetch } from "../utils/useAuthFetch";

interface UseAddTechnologyProps {
  addMessage: (props: MessageProps) => void;
  onSuccess: () => void;
}

export const useAddTechnology = ({
  addMessage,
  onSuccess,
}: UseAddTechnologyProps) => {
  const { authFetch } = useAuthFetch();

  return useMutation(
      authFetch(
        `/technology`,
        {
          method: "POST",
          body: JSON.stringify(technology),
          headers: { "Content-Type": "application/json" },
        },
        201
      ),
    {
    }
  );
};
