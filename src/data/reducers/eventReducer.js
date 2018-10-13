import { Map } from 'immutable';
import {
    POPULATE_EVENTS,
    SELECT_EVENT,
    DESELECT_EVENT,
} from '../actions/eventActions';

export const initialState = Map({
    events: [],
    selectedEvent: null,
});

export default function eventReducer(state = initialState, action = {}) {
    switch (action.type) {
        case POPULATE_EVENTS:
            return state.set('events', action.events);
        case SELECT_EVENT:
            return state.set('selectedEvent', action.selectedEvent);
        case DESELECT_EVENT:
            return state.set('selectedEvent', null);
        default:
            return state;
    }
}
