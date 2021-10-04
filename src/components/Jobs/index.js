import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {v4 as uuidv4} from 'uuid'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'

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
    searchInput: '',
    employment: '',
    salaryRange: '',
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
    const {searchInput, employment, salaryRange} = this.state
    const options = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: 'GET',
    }
    const details = await fetch(
      `https://apis.ccbp.in/jobs?employment_type=${employment}&minimum_package=${salaryRange}&search=${searchInput}`,
      options,
    )
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

  renderJobDetailsFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-bio">
        We cannot seem to find the page you are looking for
      </p>
      <button onClick={this.retryPage} type="button" className="failure-btn">
        Retry
      </button>
    </div>
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
        return this.renderJobDetailsFailureView()

      case statusDetails.inProgress:
        return this.loadingElement()

      default:
        return null
    }
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getCompanyDetailsAPI()
      console.log('tt')
    }
  }

  onSearchButton = () => {
    this.getCompanyDetailsAPI()
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  changeEmploymentType = event => {
    console.log(event.target.value)
    this.setState({employment: event.target.value}, this.getCompanyDetailsAPI)
  }

  getFirstFilteredList = () => {
    const {mergedList} = this.props
    const employmentTypesList = mergedList[0]

    return employmentTypesList.map(eachDataType => (
      <li className="list-salary" key={uuidv4()}>
        <label htmlFor={eachDataType.employmentTypeId}>
          {eachDataType.label}
        </label>

        <input
          value={eachDataType.employmentTypeId}
          type="checkbox"
          id={eachDataType.employmentTypeId}
          className="input-text"
          onChange={this.changeEmploymentType}
        />
      </li>
    ))
  }

  filterSalaryRange = event => {
    this.setState({salaryRange: event.target.value}, this.getCompanyDetailsAPI)
  }

  getSecondFilteredList = () => {
    const {mergedList} = this.props
    const salaryRangesList = mergedList[1]

    return salaryRangesList.map(eachDataSalary => (
      <li className="list-salary" key={uuidv4()}>
        <label htmlFor={eachDataSalary.salaryRangeId} className="label-text">
          {eachDataSalary.label}
        </label>

        <input
          value={eachDataSalary.salaryRangeId}
          onChange={this.filterSalaryRange}
          type="radio"
          id={eachDataSalary.salaryRangeId}
          name="salary range"
          className="input-text"
        />
      </li>
    ))
  }

  defaultAction = event => {
    event.preventDefault()
  }

  renderNoJobsFound = () => (
    <div className="display-no-results">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-logo"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="details-no-job">
        We could not find any jobs. Try other filters
      </p>
    </div>
  )

  render() {
    const {searchInput, jobDetailsList} = this.state
    const length = jobDetailsList.length > 0
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
              <form onClick={this.defaultAction}>
                <ul className="ul-employment-list">
                  {this.getFirstFilteredList()}
                </ul>
              </form>
            </div>
            <div className="filter-container">
              <h1 className="common-name">Salary Range</h1>
              <form onClick={this.defaultAction}>
                <ul className="ul-employment-list">
                  {this.getSecondFilteredList()}
                </ul>
              </form>
            </div>
          </div>
          <div className="right-container">
            <div className="search-icon-container">
              <input
                type="search"
                value={searchInput}
                onChange={this.onChangeSearchInput}
                onKeyDown={this.onEnterSearchInput}
                className="search-input"
              />
              <button
                onClick={this.onSearchButton}
                type="submit"
                testid="searchButton"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {length ? this.getJobsDetails() : this.renderNoJobsFound()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
