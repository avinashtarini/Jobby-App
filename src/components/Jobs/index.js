import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {v4 as uuidv4} from 'uuid'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import FailureView from '../FailureView'
import DisplayJobs from '../DisplayJobs'
import './index.css'

const statusDetails = {
  initial: 'INITIAL',
  inProgress: 'PROCESS',
  success: 'SUCCESS',
  fail: 'FAIL',
}

class Jobs extends Component {
  state = {
    profileList: {},
    jobDetailsList: [],
    apiRequestStatus: statusDetails.initial,
  }

  componentDidMount() {
    this.getUserDetailsAPI()
    this.getCompanyDetailsAPI()
  }

  getUserDetailsAPI = async () => {
    this.setState({
      apiRequestStatus: statusDetails.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const request = await fetch('https://apis.ccbp.in/profile', options)
    const data = await request.json()
    if (request.ok === true) {
      const updatedData = {
        profileDetails: data.profile_details,
      }
      const userDetails = updatedData.profileDetails
      const updatedUser = {
        name: userDetails.name,
        profileImg: userDetails.profile_image_url,
        bio: userDetails.short_bio,
      }
      this.setState({
        profileList: updatedUser,
        apiRequestStatus: statusDetails.success,
      })
    } else {
      console.log(request)
      console.log(data)
      this.setState({apiRequestStatus: statusDetails.fail})
    }
  }

  getCompanyDetailsAPI = async () => {
    this.setState({
      apiRequestStatus: statusDetails.inProgress,
    })
    const accessToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: 'GET',
    }
    const details = await fetch('https://apis.ccbp.in/jobs', options)
    const dataFound = await details.json()
    if (details.ok === true) {
      const newData = dataFound.jobs
      const updatedDataJobs = newData.map(eachData => ({
        companyLogoUrl: eachData.company_logo_url,
        employmentType: eachData.employment_type,
        id: eachData.id,
        jobDescription: eachData.job_description,
        location: eachData.location,
        packagePerAnnum: eachData.package_per_annum,
        rating: eachData.rating,
        title: eachData.title,
      }))
      this.setState({
        jobDetailsList: updatedDataJobs,
        apiRequestStatus: statusDetails.success,
      })
    } else {
      this.setState({apiRequestStatus: statusDetails.fail})
    }
  }

  firstFunction = () => {
    const {profileList} = this.state
    const {name, profileImg, bio} = profileList
    return (
      <div className="profile-photo">
        <img src={profileImg} alt="profile" className="profile-pic" />
        <h1 className="profile-name">{name}</h1>
        <p className="job-role">{bio}</p>
      </div>
    )
  }

  retryPage = () => {
    this.getCompanyDetailsAPI()
  }

  retryUser = () => {
    this.getUserDetailsAPI()
  }

  failureButton = () => (
    <button type="button" onClick={this.retryUser}>
      Return
    </button>
  )

  loadingElement = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  getUserDetails = () => {
    const {apiRequestStatus} = this.state

    switch (apiRequestStatus) {
      case statusDetails.success:
        return this.firstFunction()

      case statusDetails.fail:
        return this.failureButton()

      case statusDetails.inProgress:
        return this.loadingElement()

      default:
        return null
    }
  }

  getJobsDetails = () => {
    const {jobDetailsList, apiRequestStatus} = this.state
    switch (apiRequestStatus) {
      case statusDetails.success:
        return jobDetailsList.map(eachJob => (
          <DisplayJobs key={uuidv4()} jobDetailsList={eachJob} />
        ))

      case statusDetails.fail:
        return <FailureView retryFunctionCall={this.retryPage} />

      case statusDetails.inProgress:
        return this.loadingElement()

      default:
        return null
    }
  }

  getFirstFilteredList = () => {
    const {mergedList} = this.props
    const employmentTypesList = mergedList[0]

    return employmentTypesList.map(eachDataType => (
      <li className="list-salary" key={uuidv4()}>
        <label htmlFor={eachDataType.employmentTypeId} className="label-text">
          {eachDataType.label}
        </label>
        <br />
        <input
          type="checkbox"
          id={eachDataType.employmentTypeId}
          className="input-text"
        />
      </li>
    ))
  }

  getSecondFilteredList = () => {
    const {mergedList} = this.props
    const salaryRangesList = mergedList[1]

    return salaryRangesList.map(eachDataSalary => (
      <li className="list-salary" key={uuidv4()}>
        <label htmlFor={eachDataSalary.salaryRangeId} className="label-text">
          {eachDataSalary.label}
        </label>
        <br />
        <input
          type="radio"
          id={eachDataSalary.salaryRangeId}
          className="input-text"
        />
      </li>
    ))
  }

  render() {
    const jsToken = Cookies.get('jwt_token')
    if (jsToken === undefined) {
      return <Redirect to="/login" />
    }
    return (
      <>
        <Header />
        <div className="jobs-page-background">
          <div className="left-container">
            <div className="Job-profile">{this.getUserDetails()}</div>
            <div className="filter-container">
              <h1 className="common-name">Type of Employment</h1>
              <ul className="ul-employment-list">
                {this.getFirstFilteredList()}
              </ul>
            </div>
            <div className="filter-container">
              <h1 className="common-name">Salary Range</h1>
              <ul className="ul-employment-list">
                {this.getSecondFilteredList()}
              </ul>
            </div>
          </div>
          <div className="right-container">
            <div className="search-icon-container">
              <input type="search" className="search-input" />
              <button type="button" testid="searchButton">
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.getJobsDetails()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
