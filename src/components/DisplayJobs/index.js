import {Link} from 'react-router-dom'

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
            <h1 className="job-name">{title}</h1>
            <p className="rating">{rating}</p>
          </div>
          <div className="package-container">
            <p className="city">{location}</p>
            <p className="job-type">{employmentType}</p>
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
