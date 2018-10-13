import { Map } from 'immutable';
import {
    TOGGLE_LOADER,
} from '../actions/loaderActions';

export const initialState = Map({
    loader: false,
});

/* ImmutableJS is great for keeping reducers pure */
export default function eventReducer(state = initialState, action = {}) {
    switch (action.type) {
        case TOGGLE_LOADER:
            return state.set('loader', !state.get('loader'));
        default:
            return state;
    }
}
