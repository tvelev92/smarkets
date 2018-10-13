import { combineReducers } from 'redux';
import eventReducer from './eventReducer';
import loader from './loader';

export default combineReducers({
    eventReducer,
    loader,
})