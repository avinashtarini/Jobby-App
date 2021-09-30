import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {GrMenu} from 'react-icons/gr'
import './index.css'

const Header = props => {
  const getLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
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
      <button onClick={getLogout} className="logout" type="button">
        Logout
      </button>
      <div className="nav-elements-mobile">
        <GrMenu className="menu-bar-item" />
      </div>
    </nav>
  )
}
export default withRouter(Header)
