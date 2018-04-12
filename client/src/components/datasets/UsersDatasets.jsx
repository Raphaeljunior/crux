import React, { Component } from "react"
import { Route } from "react-router-dom"
import DatasetCard from "./DatasetCard"
import gql from "graphql-tag"
import { graphql, Query } from "react-apollo"
import DatasetDetail from "./DatasetDetail"

class UsersDatasets extends Component {
  render() {
    return (
      <React.Fragment>
        <h1 className="title">My datasets</h1>
        <section className="columns is-multiline is-mobile">
          <Query query={USER_DATASETS}>
            {({ loading, error, data }) => {
              if (error) return ""
              if (loading) return ""

              const { userDatasets } = data
              return (
                userDatasets &&
                userDatasets.map((dataset, idx) => (
                  <div key={idx} className="column is-3-desktop">
                    <DatasetCard {...dataset} />
                  </div>
                ))
              )
            }}
          </Query>
        </section>
      </React.Fragment>
    )
  }
}

const USER_DATASETS = gql`
  query userDatasetsQuery {
    userDatasets {
      name
      description
      uuid
    }
  }
`

export default UsersDatasets
