import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {GrMenu, GrHome, GrLogout} from 'react-icons/gr'
import './index.css'

class Header extends Component {
  state = {activeStatus: false}

  getLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = this.props
    history.replace('/login')
  }

  getIconsHome = () => {
    console.log('clicked')
    return (
      <>
        <Link to="/">
          <GrHome className="menu-bar-item" />
        </Link>
        <GrLogout className="menu-bar-item" onClick={this.getLogout} />
      </>
    )
  }

  onClickIcon = () => {
    this.setState(previousState => ({
      activeStatus: !previousState.activeStatus,
    }))
  }

  render() {
    const {activeStatus} = this.state
    return (
      <nav className="header">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo"
          />
        </Link>
        <div className="nav-elements-lg">
          <Link to="/" className="home">
            Home
          </Link>
          <Link to="/jobs" className="home">
            Jobs
          </Link>
        </div>
        <button onClick={this.getLogout} className="logout" type="button">
          Logout
        </button>
        <div className="nav-elements-mobile">
          <GrMenu className="menu-bar-item" onClick={this.onClickIcon} />
          {activeStatus && this.getIconsHome()}
        </div>
      </nav>
    )
  }
}
export default Header
