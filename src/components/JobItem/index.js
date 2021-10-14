import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsStarFill, BsBagFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {BiLinkExternal} from 'react-icons/bi'
import Header from '../Header'

import './index.css'

const statusBar = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  fail: 'FAIL',
  loading: 'LOADING',
}

class JobItem extends Component {
  state = {
    detailsOfJob: {},
    similarJobsList: [],
    skillsList: [],
    lifestyleList: {},
    loadingStatus: statusBar.initial,
  }

  componentDidMount() {
    this.fetchUrlData()
  }

  fetchUrlData = async () => {
    this.setState({loadingStatus: statusBar.loading})

    const {match} = this.props
    const {params} = match
    const {id} = params
    const URL = `https://apis.ccbp.in/jobs/${id}`
    const loginToken = Cookies.get('jwt_token')
    console.log(loginToken)
    const optionsId = {
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
      method: 'GET',
    }
    const awaitedData = await fetch(URL, optionsId)
    const stringData = await awaitedData.json()

    if (awaitedData.ok === true) {
      const updatedStringList = {
        jobDetails: stringData.job_details,
        similarJobs: stringData.similar_jobs,
      }
      const initialJobDetails = updatedStringList.jobDetails
      const updatedJobDetails = {
        companyLogoUrl: initialJobDetails.company_logo_url,
        companyWebsiteUrl: initialJobDetails.company_website_url,
        employmentSection: initialJobDetails.employment_type,
        id: initialJobDetails.id,
        jobDescription: initialJobDetails.job_description,
        location: initialJobDetails.location,
        packagePerAnnum: initialJobDetails.package_per_annum,
        rating: initialJobDetails.rating,
        title: initialJobDetails.title,
        skills: initialJobDetails.skills,
        lifeAtCompany: initialJobDetails.life_at_company,
      }
      const updatedSimilarJobs = updatedStringList.similarJobs.map(
        eachValue => ({
          companyLogoUrl: eachValue.company_logo_url,
          employmentType: eachValue.employment_type,
          id: eachValue.id,
          jobDescription: eachValue.job_description,
          location: eachValue.location,
          rating: eachValue.rating,
          title: eachValue.title,
        }),
      )
      const updatedSkillList = updatedJobDetails.skills.map(eachSkill => ({
        imageUrl: eachSkill.image_url,
        name: eachSkill.name,
      }))
      const companyLifeStyle = updatedJobDetails.lifeAtCompany
      const updatedCompanyLifeStyle = {
        description: companyLifeStyle.description,
        imageUrl: companyLifeStyle.image_url,
      }
      this.setState({
        detailsOfJob: updatedJobDetails,
        similarJobsList: updatedSimilarJobs,
        skillsList: updatedSkillList,
        lifestyleList: updatedCompanyLifeStyle,
        loadingStatus: statusBar.success,
      })
    } else {
      this.setState({
        loadingStatus: statusBar.fail,
      })
      console.log(awaitedData)
      console.log(stringData)
    }
  }

  onClickButtonIcon = () => {
    this.fetchUrlData()
  }

  getFailureView = () => (
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
      <button
        onClick={this.onClickButtonIcon}
        type="button"
        className="failure-btn"
      >
        Retry
      </button>
    </div>
  )

  render() {
    const {
      detailsOfJob,
      skillsList,
      lifestyleList,
      similarJobsList,
      loadingStatus,
    } = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentSection,
      jobDescription,
      location,
      rating,
      title,
      packagePerAnnum,
    } = detailsOfJob
    const {description, imageUrl} = lifestyleList

    switch (loadingStatus) {
      case statusBar.success:
        return (
          <>
            <Header />
            <div className="job-item-container-item">
              <div className="job-description-container">
                <div className="icon-container">
                  <img
                    src={companyLogoUrl}
                    alt="job details company logo"
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
                      <p className="job-type">{employmentSection}</p>
                    </div>
                  </div>
                  <p className="salary">{packagePerAnnum}</p>
                </div>

                <div className="desc-container">
                  <div className="visit-container">
                    <h1 className="details-job">Description</h1>
                    <a
                      href={companyWebsiteUrl}
                      className="link"
                      rel="noreferrer"
                      target="_blank"
                    >
                      Visit{' '}
                      <span>
                        <BiLinkExternal />
                      </span>
                    </a>
                  </div>
                </div>
                <p className="company-details">{jobDescription}</p>
                <p className="details-job">Skills</p>
                <ul className="skills-container">
                  {skillsList.map(eachLists => (
                    <li className="skill-list" key={eachLists.name}>
                      <img
                        src={eachLists.imageUrl}
                        alt={eachLists.name}
                        className="skill-logo"
                      />
                      <h1 className="skill-name">{eachLists.name}</h1>
                    </li>
                  ))}
                </ul>
                <div className="life-at-company-container">
                  <h1 className="details-job">Life at Company</h1>
                  <div className="inside-containers-life">
                    <p className="company-lifestyle">{description}</p>
                    <img
                      src={imageUrl}
                      alt="life at company"
                      className="life-company-url"
                    />
                  </div>
                </div>
              </div>
              <div className="similar-jobs-container">
                <h1 className="similar-jobs-heading">Similar jobs</h1>
                <ul className="similar-jobs-ul-list">
                  {similarJobsList.map(eachSimilar => (
                    <li className="similar-list-item" key={eachSimilar.id}>
                      <div className="icon-container">
                        <img
                          src={eachSimilar.companyLogoUrl}
                          alt="similar job company logo"
                          className="company-logo"
                        />
                        <div className="rating-container">
                          <h1 className="job-name">{eachSimilar.title}</h1>
                          <div className="rating-display">
                            <BsStarFill />
                            <p className="rating">{eachSimilar.rating}</p>
                          </div>
                        </div>
                      </div>
                      <div className="similar-job-description-container">
                        <h1 className="details-job">Description</h1>
                        <p className="company-details">
                          {eachSimilar.jobDescription}
                        </p>
                      </div>
                      <div className="similar-job-location-type">
                        <div className="similar-job-location-container">
                          <MdLocationOn className="similar-icons-style" />
                          <p className="city">{eachSimilar.location}</p>
                        </div>
                        <div className="similar-job-location-container">
                          <BsBagFill className="similar-icons-style" />
                          <p className="job-type">
                            {eachSimilar.employmentType}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )
      case statusBar.fail:
        return this.getFailureView()
      case statusBar.loading:
        return (
          <div className="loader-container" testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        )
      default:
        return null
    }
  }
}

export default JobItem
