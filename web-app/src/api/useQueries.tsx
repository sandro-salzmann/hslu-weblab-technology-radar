import { useAuth0 } from "@auth0/auth0-react";
import {
  Authorization,
  TechnologyCategory,
  TechnologyData,
  TechnologyHistoryData,
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


export const usePermissionsQuery = () => {
  const { isAuthenticated } = useAuth0();
  const { authFetch } = useAuthFetch();

  const fetchPermissions = async () => {
    const results = (await authFetch(`/permissions`)) as Authorization;
    return results;
  };

  return useQuery<Authorization, Error>(["permissions"], fetchPermissions, {
    enabled: isAuthenticated,
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

export const useTechnologyHistoryQuery = (
  id?: string,
  startQuerying: boolean = true
) => {
  const { isAuthenticated } = useAuth0();
  const { authFetch } = useAuthFetch();

  const fetchTechnologyHistory = async () => {
    const results = (await authFetch(
      `/technology/history/${id}`
    )) as TechnologyHistoryData;
    return results;
  };

  return useQuery<TechnologyHistoryData, Error>(
    ["technology", "history", id],
    fetchTechnologyHistory,
    {
      enabled: isAuthenticated && !!id && startQuerying,
    }
  );
};
