import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "semantic-ui-react";
import { toCapitalize } from "../utils/toCapitalize";

export const Header = () => {
  const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname.slice(1);

  const onLoginClick = () => loginWithRedirect();

  const onLogoutClick = () => logout({ returnTo: window.location.origin });

  const onAdministrationClick = () => navigate("admin");

  const buttonLoadingProps = {
    disabled: isLoading,
    loading: isLoading,
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h1 style={{ marginBottom: 0 }}>{`📡 Techradar${
        pathname ? `: ${toCapitalize(pathname)}` : ""
      }`}</h1>
      {isAuthenticated ? (
        <div>
          {pathname === "" && (
            <Button
              onClick={onAdministrationClick}
              primary
              size="big"
              content="Open administration"
              {...buttonLoadingProps}
            />
          )}
          <Button
            onClick={onLogoutClick}
            style={{ marginRight: 0 }}
            basic
            size="big"
            content="Logout"
            {...buttonLoadingProps}
          />
        </div>
      ) : (
        <Button
          onClick={onLoginClick}
          style={{ marginRight: 0 }}
          primary={!isLoading}
          size="big"
          content={isLoading ? "Logout" : "Login"}
          {...buttonLoadingProps}
        />
      )}
    </div>
  );
};
