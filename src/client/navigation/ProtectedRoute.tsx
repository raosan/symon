import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";

interface Props extends RouteProps {
  component: React.FC;
}

const ProtectedRoute: React.FC<Props> = ({ component, ...restOfProps }) => {
  const isAuthenticated = window.localStorage.getItem("at") || "";

  return (
    <Route
      {...restOfProps}
      render={({ location }) => {
        return isAuthenticated ? (
          component
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
