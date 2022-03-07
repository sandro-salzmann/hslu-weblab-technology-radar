import { useAuth0 } from "@auth0/auth0-react";
import {
  TechnologyCategory,
  TechnologyData,
  TechnologyPreviewData,
} from "common";
import { useQuery } from "react-query";
import { useAuthFetch } from "../utils/useAuthFetch";

export const useTechnologyQuery = (id?: string) => {
  const { isAuthenticated } = useAuth0();
  const { authFetch } = useAuthFetch();

  const fetchTechnology = async () => {
    const results = (await authFetch(`/technology/${id}`)) as TechnologyData;
    return results;
  };

  return useQuery<TechnologyData, Error>(["technology", id], fetchTechnology, {
    enabled: isAuthenticated && !!id,
  });
};

export const useTechnologyPreviewsQuery = (category?: TechnologyCategory) => {
  const { isAuthenticated } = useAuth0();
  const { authFetch } = useAuthFetch();

  const fetchTechnologyPreviews = async () => {
    return await authFetch(
      `/technology/preview${category ? `?category=${category}` : ""}`
    );
  };

  return useQuery<TechnologyPreviewData[], Error>(
    ["technology-previews", category],
    fetchTechnologyPreviews,
    {
      enabled: isAuthenticated,
    }
  );
};
