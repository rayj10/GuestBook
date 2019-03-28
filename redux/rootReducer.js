import { combineReducers } from 'redux';

import miscReducer from "../reducers/miscReducer";

// Combine all the reducers
const rootReducer = combineReducers({ miscReducer });

export default rootReducer;
