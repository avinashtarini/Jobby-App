import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => (
  <>
    <Header />
    <div className="home-page">
      <h1 className="heading-home">Find The Job That Fits Your Life</h1>
      <p className="para-home">
        Millions of people are searching for jobs, salary,
        <br />
        information,company reviews.
        <br /> Find the job that fits your ability and potential
      </p>
      <Link to="/jobs">
        <button type="button" className="btn btn-lg ">
          Find Jobs
        </button>
      </Link>
    </div>
  </>
)

export default Home
