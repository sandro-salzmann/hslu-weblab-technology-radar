import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Button } from "semantic-ui-react";

export const Header = () => {
  const { loginWithRedirect, logout } = useAuth0();
  const { isAuthenticated, isLoading } = useAuth0();

  const onLoginClick = async () => {
    loginWithRedirect();
  };

  const onLogoutClick = async () => {
    logout({ returnTo: window.location.origin });
  };

  return (
    <div style={{ paddingTop: 16 }}>
      <h1 style={{ display: "inline-block", paddingRight: 16 }}>
        📡 Techradar
      </h1>
      {isLoading ? (
        "Loading..."
      ) : isAuthenticated ? (
        <Button
          onClick={onLogoutClick}
          style={{ float: "right" }}
          basic
          size="big"
          content="Logout"
        />
      ) : (
        <Button
          onClick={onLoginClick}
          style={{ float: "right" }}
          primary
          size="big"
          content="Login"
        />
      )}
    </div>
  );
};
