import React, { Component } from "react"
import { Route } from "react-router-dom"
import Figshare from "./components/auth/Figshare"
import AnalysesView from "./views/AnalysesView"
import AnalysisPage from "./views/AnalysisPage"
import AuthView from "./views/AuthView"
import DashboardView from "./views/DashboardView"
import DatasetPage from "./views/DatasetPage"
import DatasetsView from "./views/DatasetsView"
import HomeView from "./views/HomeView"
import UserPage from "./views/UserPage"

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Route exact path="/" render={props => <HomeView {...props} />} />
        <Route path="/signup" render={props => <AuthView {...props} />} />
        <Route path="/login" render={props => <AuthView {...props} />} />
        <Route path="/logout" render={props => <AuthView {...props} />} />
        <Route path="/dashboard" render={() => <DashboardView />} />
        <Route path="/datasets" render={() => <DatasetsView />} />
        <Route path="/analyses" render={() => <AnalysesView />} />
        <Route
          path="/oauth/figshare"
          render={props => <Figshare {...props} />}
        />
        <Route
          path="/dataset/:uuid([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})"
          render={() => <DatasetPage />}
        />
        <Route
          path="/analysis/:uuid([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})"
          render={() => <AnalysisPage />}
        />
        <Route
          exact
          path="/:username(([a-z0-9]+){1})"
          render={props => <UserPage {...props} />}
        />
      </React.Fragment>
    )
  }
}

export default App
