import React, { Component } from "react"
import { Link } from "react-router-dom"
import { graphql, compose, withApollo } from "react-apollo"
import { withRouter } from "react-router-dom"
import gql from "graphql-tag"

import { loginUser, createUser } from "../../queries/users.gql"
import { config } from "../../config"
class AuthForm extends Component {
  state = {
    displayLogin: true,
    email: "",
    password: "",
    error: false,
    errorMessage: "",
  }

  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  logout = async () => {
    await localStorage.removeItem(config.TOKEN_NAME)
    this.props.client.resetStore()
    this.props.history.push("/login")
  }

  handleFormSubmit = async e => {
    e.preventDefault()
    const { email, password } = this.state
    if (this.state.displayLogin) {
      // Login
      const result = await this.props
        .loginUserMutation({
          variables: {
            email: email,
            password: password,
          },
        })
        .then(({ data }) => {
          localStorage.setItem(config.TOKEN_NAME, data.loginUser.token)
          this.props.history.push("/dashboard") // Send back to URL from where user was sent to login
        })
        .catch(error => {
          this.setState({ error: true, errorMessage: "Invalid credentials" })
        })
    } else {
      // Sign up
      const result = await this.props
        .createUserMutation({
          variables: {
            email: email,
            password: password,
          },
        })
        .then(({ data }) => {
          this.props.history.push("/login")
        })
        .catch(error => {
          this.setState({
            error: true,
            errorMessage: "That account already exists",
          })
        })
    }
  }

  setLogin = displayLogin => {
    this.setState({ displayLogin: displayLogin, error: false })
  }

  render() {
    const { match, history } = this.props
    if (match.path == "/logout") {
      this.logout()
    }

    const token = localStorage.getItem(config.TOKEN_NAME)
    const { displayLogin } = this.state

    return (
      <form
        className="box is-narrow"
        onSubmit={this.handleFormSubmit.bind(this)}
        name={displayLogin ? "formlogin" : "formsignup"}
      >
        <p className="has-text-weight-bold is-size-4 has-text-centered has-text-dark">
          {displayLogin ? "Login" : "Sign Up"}
        </p>
        <div className="field">
          <label htmlFor="email" className="label">
            E-Mail
          </label>
          <div className="control">
            <input
              type="email"
              value={this.state.email}
              name="email"
              onChange={this.handleInputChange.bind(this)}
              className="input"
              placeholder="johndoe@gmail.com"
              required
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="password" className="label">
            Password
          </label>
          <div className="control">
            <input
              type="password"
              value={this.state.password}
              name="password"
              onChange={this.handleInputChange.bind(this)}
              className="input"
              placeholder="Password"
              required
            />
          </div>
        </div>
        {this.state.error ? <div>{this.state.errorMessage}</div> : ""}
        <div className="field">
          <div className="control">
            <input
              type="submit"
              className="button is-primary"
              id={displayLogin ? "login" : "signup"}
              value={displayLogin ? "Log in" : "Sign Up"}
            />
            {displayLogin ? (
              <p>
                Don't have an account?{" "}
                <Link to="/signup" onClick={this.setLogin.bind(this, false)}>
                  Sign up
                </Link>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <Link to="/login" onClick={this.setLogin.bind(this, true)}>
                  Log in
                </Link>
              </p>
            )}
          </div>
        </div>
        {displayLogin ? <p>Log in with</p> : <p>Sign up with</p>}
        <div className="buttons">
          <input type="button" className="button" value="Google" />
          <input type="button" className="button" value="Twitter" />
          <input type="button" className="button" value="Facebook" />
          <a href="https://figshare.com/account/applications/authorize?client_id=607c859796024acc29dfe97a69ac2609a078de64&response_type=token&redirect_url=http://localhost:3000/oauth/figshare/callback">
            <input type="button" className="button" value="Figshare" />
          </a>
        </div>
      </form>
    )
  }
}

class Login extends Component {
  state = {
    displayLogin: true,
    email: "",
    password: "",
    error: false,
    errorMessage: "",
  }

  _handleInput = ({ target }) => {
    this.setState({
      [target.name]: target.value,
    })
  }

  _handleFormSubmit = async e => {
    e.preventDefault()
    const { email, password } = this.state
    const result = await this.props
      .loginUser({
        variables: {
          email: email,
          password: password,
        },
      })
      .then(({ data }) => {
        localStorage.setItem(config.TOKEN_NAME, data.loginUser.token)
        this.props.history.push("/dashboard") // Send back to URL from where user was sent to login
      })
      .catch(error => {
        this.setState({ error: true, errorMessage: "Invalid credentials" })
      })
  }

  render() {
    return (
      <form
        className="box is-narrow"
        onSubmit={this._handleFormSubmit}
        name="formlogin"
      >
        <p className="has-text-weight-bold is-size-4 has-text-centered has-text-dark">
          Login
        </p>
        <div className="field">
          <label htmlFor="email" className="label">
            E-Mail
          </label>
          <div className="control">
            <input
              type="email"
              value={this.state.email}
              name="email"
              onChange={this._handleInput}
              className="input"
              placeholder="johndoe@gmail.com"
              required
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="password" className="label">
            Password
          </label>
          <div className="control">
            <input
              type="password"
              value={this.state.password}
              name="password"
              onChange={this._handleInput}
              className="input"
              placeholder="Password"
              required
            />
          </div>
        </div>
        {this.state.error ? <div>{this.state.errorMessage}</div> : ""}
        <div className="field">
          <div className="control">
            <input
              type="submit"
              className="button is-primary"
              id="login"
              value="Log in"
            />
            <p>
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
        <p>Log in with</p>
        <div className="buttons">
          <a href="https://figshare.com/account/applications/authorize?client_id=607c859796024acc29dfe97a69ac2609a078de64&response_type=token&redirect_url=http://localhost:3000/oauth/figshare/callback">
            <input type="button" className="button" value="Figshare" />
          </a>
        </div>
      </form>
    )
  }
}

class Signup extends Component {
  state = {
    email: "",
    password: "",
    error: false,
    errorMessage: "",
  }

  _handleInput = ({ target }) => {
    this.setState({
      [target.name]: target.value,
    })
  }

  _handleFormSubmit = async e => {
    e.preventDefault()
    const result = await this.props
      .createUser({
        variables: {
          email: email,
          password: password,
        },
      })
      .then(({ data }) => {
        this.props.history.push("/login")
      })
      .catch(error => {
        this.setState({
          error: true,
          errorMessage: "That account already exists",
        })
      })
  }

  render() {
    return (
      <form
        className="box is-narrow"
        onSubmit={this._handleFormSubmit}
        name="formlogin"
      >
        <p className="has-text-weight-bold is-size-4 has-text-centered has-text-dark">
          Signup
        </p>
        <div className="field">
          <label htmlFor="email" className="label">
            E-Mail
          </label>
          <div className="control">
            <input
              type="email"
              value={this.state.email}
              name="email"
              onChange={this._handleInput}
              className="input"
              placeholder="johndoe@gmail.com"
              required
            />
          </div>
        </div>
        <div className="field">
          <label htmlFor="password" className="label">
            Password
          </label>
          <div className="control">
            <input
              type="password"
              value={this.state.password}
              name="password"
              onChange={this._handleInput}
              className="input"
              placeholder="Password"
              required
            />
          </div>
        </div>
        {this.state.error ? <div>{this.state.errorMessage}</div> : ""}
        <div className="field">
          <div className="control">
            <input
              type="submit"
              className="button is-primary"
              id="login"
              value="Sign up"
            />
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
        <p>Signup with</p>
        <div className="buttons">
          <a href="https://figshare.com/account/applications/authorize?client_id=607c859796024acc29dfe97a69ac2609a078de64&response_type=token&redirect_url=http://localhost:3000/oauth/figshare/callback">
            <input type="button" className="button" value="Figshare" />
          </a>
        </div>
      </form>
    )
  }
}

const Logout = ({ client, history }) => {
  localStorage.removeItem(config.TOKEN_NAME)
  client.resetStore()
  history.push("/login")
  return ""
}

const LoginForm = compose(
  withRouter,
  withApollo,
  graphql(loginUser, { name: "loginUser" })
)(Login)

const SignupForm = compose(
  withRouter,
  withApollo,
  graphql(createUser, { name: "createUser" })
)(Signup)

const LogoutForm = compose(withRouter, withApollo)(Logout)

export { LoginForm, LogoutForm, SignupForm }
