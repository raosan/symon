import { Switch, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Organization from "../pages/Organization";
import Project from "../pages/Project";
import Probe from "../pages/Probe";
import Setup from "../pages/Setup";

export const RouterConfig = (): JSX.Element => {
  return (
    <Switch>
      <Route path="/setup" component={Setup} />
      <Route path="/login" component={Login} />
      <Route path="/:orgName/:projectName/:probeName" component={Probe} />
      <Route path="/:orgName/:projectName" component={Project} />
      <Route path="/:orgName" component={Organization} />
      <Route path="/" component={Home} />
    </Switch>
  );
};
