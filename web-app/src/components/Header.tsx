import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { useLocation } from "react-router-dom";
import { Button } from "semantic-ui-react";
import { toCapitalize } from "../utils/toCapitalize";

export const Header = () => {
  const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();
  const location = useLocation();
  const pathname = location.pathname.slice(1);

  const onLoginClick = async () => {
    loginWithRedirect();
  };

  const onLogoutClick = async () => {
    logout({ returnTo: window.location.origin });
  };

  return (
    <div
      style={{
        paddingTop: 16,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h1 style={{ marginBottom: 0 }}>{`📡 Techradar${
        pathname ? `: ${toCapitalize(pathname)}` : ""
      }`}</h1>
      {isAuthenticated ? (
        <Button
          onClick={onLogoutClick}
          style={{ marginRight: 0 }}
          basic
          size="big"
          content="Logout"
          disabled={isLoading}
          loading={isLoading}
        />
      ) : (
        <Button
          onClick={onLoginClick}
          style={{ marginRight: 0 }}
          primary={!isLoading}
          size="big"
          content={isLoading ? "Logout" : "Login"}
          disabled={isLoading}
          loading={isLoading}
        />
      )}
    </div>
  );
};
