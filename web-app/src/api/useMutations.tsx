import { TechnologyCategory, TechnologyMaturity } from "common";
import { useMutation, useQueryClient } from "react-query";
import { MessageProps } from "semantic-ui-react";
import { useAuthFetch } from "../utils/useAuthFetch";

export interface AddTechnologyBody {
  name: string;
  category: TechnologyCategory;
  maturity?: TechnologyMaturity;
  description: string;
  maturityDescription?: string;
}

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
    (technology: AddTechnologyBody) =>
      authFetch(`/technology`, {
        method: "POST",
        body: JSON.stringify(technology),
        headers: { "Content-Type": "application/json" },
      }),
    {
    }
  );
};
