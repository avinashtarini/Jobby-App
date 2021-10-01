import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', loginStatus: false, errorMsg: ''}

  onLoginSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 1})

    history.replace('/')
  }

  onLoginFailure = error => {
    this.setState({
      username: '',
      password: '',
      loginStatus: true,
      errorMsg: error,
    })
  }

  getLoginDetails = async () => {
    const {username, password} = this.state
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const request = await fetch('https://apis.ccbp.in/login', options)
    const data = await request.json()
    console.log(request)
    console.log(data)
    if (request.ok === true) {
      this.onLoginSuccess(data.jwt_token)
    } else {
      this.onLoginFailure(data.error_msg)
    }
  }

  getUsername = event => {
    this.setState({username: event.target.value})
  }

  getPassword = event => {
    this.setState({password: event.target.value})
  }

  loginToWeb = event => {
    event.preventDefault()
    this.getLoginDetails()
  }

  render() {
    const {username, password, loginStatus, errorMsg} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="bg-container">
        <div className="inside-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo"
          />
          <form onSubmit={this.loginToWeb} className="form-container">
            <div className="text">
              <label htmlFor="login" className="label-input">
                USERNAME
              </label>
              <br />
              <input
                placeholder="Username"
                type="text"
                id="login"
                className="input-text"
                value={username}
                onChange={this.getUsername}
              />
            </div>
            <div className="text">
              <label htmlFor="password" className="label-input">
                PASSWORD
              </label>
              <br />
              <input
                placeholder="Password"
                type="password"
                id="password"
                className="input-text"
                value={password}
                onChange={this.getPassword}
              />
            </div>
            {loginStatus && <p className="error-msg">{errorMsg}</p>}
            <button type="submit" className="btn">
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
