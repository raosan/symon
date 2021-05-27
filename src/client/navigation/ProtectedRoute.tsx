import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";

interface Props extends RouteProps {
  component: React.FC;
}

const ProtectedRoute: React.FC<Props> = ({
  component: Component,
  ...restOfProps
}) => {
  const isAuthenticated = window.localStorage.getItem("at") || "";

  return (
    <Route
      {...restOfProps}
      render={({ location }) => {
        return isAuthenticated ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default ProtectedRoute;
