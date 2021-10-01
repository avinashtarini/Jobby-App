import './index.css'

const FailureView = props => {
  const {retryFunctionCall} = props

  const onClickButtonIcon = () => {
    retryFunctionCall()
  }

  return (
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
      <button onClick={onClickButtonIcon} type="button" className="failure-btn">
        Retry
      </button>
    </div>
  )
}
export default FailureView
