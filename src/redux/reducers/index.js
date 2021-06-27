import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import auth from './auth'


const reducer = combineReducers({
  routing: routerReducer,
  auth,

})

export default reducer
