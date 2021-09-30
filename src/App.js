import {Route, Switch} from 'react-router-dom'
import WrappedComponent from './components/WrappedComponent'
import Login from './components/Login'
import Home from './components/Home'
import JobItem from './components/JobItem'
import Jobs from './components/Jobs'
import NotFound from './components/NotFound'
import './App.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <WrappedComponent exact path="/" component={Home} />
    <WrappedComponent exact path="/jobs" component={Jobs} />
    <WrappedComponent exact path="/jobs/:id" component={JobItem} />
    <Route exact path="/bad-path" component={NotFound} />
    <Route component={NotFound} />
  </Switch>
)

export default App
