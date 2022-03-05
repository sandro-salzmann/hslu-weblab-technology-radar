import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import {
  Technology,
  TechnologyCategory,
  TechnologyPreview,
} from "../typings/technology";
import { useAuthFetch } from "../utils/useAuthFetch";

export const useGetTechnologyPreviews = (category?: TechnologyCategory) => {
  const { authFetch } = useAuthFetch();
  const { isAuthenticated } = useAuth0();

  const [technologyPreviews, setTechnologyPreviews] =
    useState<TechnologyPreview[]>();
  const [hasError, setHasError] = useState<boolean>(false);

  const fetchTechnologyPreviews = async () => {
    try {
      setHasError(false);
      setTechnologyPreviews(undefined);
      const results = (await authFetch(
        `/technology?preview=true${category ? `&category=${category}` : ""}`
      )) as TechnologyPreview[];
      setTechnologyPreviews(results);
    } catch (error) {
      console.error(error);
      setHasError(true);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchTechnologyPreviews();
  }, [isAuthenticated, category]);

  return {
    technologyPreviews: technologyPreviews || [],
    isLoading: !technologyPreviews,
    hasError,
  };
};

export const useGetTechnology = (id?: string) => {
  const { authFetch } = useAuthFetch();
  const { isAuthenticated } = useAuth0();

  const [technology, setTechnology] = useState<Technology>();
  const [hasError, setHasError] = useState<boolean>(false);

  const fetchTechnology = async () => {
    try {
      setHasError(false);
      setTechnology(undefined);
      const results = (await authFetch(`/technology?id=${id}`)) as Technology;
      setTechnology(results);
    } catch (error) {
      console.error(error);
      setHasError(true);
    }
  };

  useEffect(() => {
    if (isAuthenticated && id) fetchTechnology();
  }, [isAuthenticated, id]);

  return {
    technology: technology || {
      category: "",
      maturity: "",
      name: "",
      description: "",
      descriptionClassification: "",
    },
    isLoading: !technology,
    hasError,
  };
};
