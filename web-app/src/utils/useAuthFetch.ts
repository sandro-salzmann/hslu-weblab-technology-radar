import { useAuth0 } from "@auth0/auth0-react";

export const useAuthFetch = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const authFetch = async (
    input: RequestInfo,
    init: RequestInit = {},
    expectStatus?: number
  ) => {
    if (!isAuthenticated) {
      throw new Error("User not authenticated.");
    }
    if (!process.env.REACT_APP_AUTH0_AUDIENCE)
      throw new Error("REACT_APP_AUTH0_AUDIENCE not set.");

    const accessToken = await getAccessTokenSilently({
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      scope: "openid profile email",
    });
    const result = await fetch(process.env.REACT_APP_AUTH0_AUDIENCE + input, {
      ...init,
      headers: {
        ...init.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (expectStatus && result.status != expectStatus) {
      const { error } = await result.json();
      throw new Error(error);
    } else {
      return await result.json();
    }
  };

  return { authFetch };
};
