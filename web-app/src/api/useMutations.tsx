import { PatchTechnologyBody, PostTechnologyBody } from "common";
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
  const queryClient = useQueryClient();

  return useMutation(
    (technology: PostTechnologyBody) =>
      authFetch(
        `/technology`,
        {
          method: "POST",
          body: JSON.stringify({
            ...technology,
            maturity:
              // @ts-ignore maturity is "" when cleared by input field
              technology.maturity === "" ? undefined : technology.maturity,
            maturityDescription:
              technology.maturityDescription === ""
                ? undefined
                : technology.maturityDescription,
          }),
          headers: { "Content-Type": "application/json" },
        },
        201
      ),
    {
      onError: (error, variables, context) => {
        addMessage({
          negative: true,
          header: "Failed to add technology!",
          icon: "warning sign",
        });
      },
      onSuccess: async (data, postTechnologyBody, context) => {
        await queryClient.refetchQueries(["technology-previews"]);
        // TODO: use setQueryData instead of refetchQueries
        addMessage({
          positive: true,
          header: "Successfully added technology!",
          icon: "check circle outline",
        });
        onSuccess();
      },
    }
  );
};

interface UsePatchTechnologyProps {
  onSuccess: () => void;
}

export const usePatchTechnology = ({ onSuccess }: UsePatchTechnologyProps) => {
  const { authFetch } = useAuthFetch();
  const queryClient = useQueryClient();

  return useMutation(
    (technology: PatchTechnologyBody) =>
      authFetch(
        `/technology`,
        {
          method: "PATCH",
          body: JSON.stringify(technology),
          headers: { "Content-Type": "application/json" },
        },
        200
      ),
    {
      onError: (error, variables, context) => {
        console.error(error);
        alert(`Failed to publish category! (${error})`);
      },
      onSuccess: async (data, postTechnologyBody, context) => {
        await queryClient.refetchQueries(["technology-previews"]);
        await queryClient.refetchQueries(["technology"]);
        // TODO: use setQueryData instead of refetchQueries
        onSuccess();
      },
    }
  );
};
