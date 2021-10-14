import {Link} from 'react-router-dom'
import {BsStarFill, BsBagFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'

import './index.css'

const DisplayJobs = props => {
  const {jobDetailsList} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobDetailsList

  return (
    <ul className="job-ul-list">
      <Link to={`/jobs/${id}`} className="link-list">
        <li className="job-li-item">
          <div className="icon-container">
            <img
              src={companyLogoUrl}
              alt="company logo"
              className="company-logo"
            />
            <div className="rating-container">
              <h1 className="job-name">{title}</h1>
              <div className="rating-display">
                <BsStarFill />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="package-container">
            <div className="class-on">
              <div className="job-location-container">
                <MdLocationOn className="icons-style" />
                <p className="city">{location}</p>
              </div>
              <div className="job-location-container">
                <BsBagFill className="icons-style" />
                <p className="job-type">{employmentType}</p>
              </div>
            </div>
            <p className="salary">{packagePerAnnum}</p>
          </div>
          <div className="desc-container">
            <h1 className="details-job">Description</h1>
            <p className="company-details">{jobDescription}</p>
          </div>
        </li>
      </Link>
    </ul>
  )
}

export default DisplayJobs
