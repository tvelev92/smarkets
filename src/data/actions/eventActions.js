export const POPULATE_EVENTS = 'POPULATE_EVENTS';
export const SELECT_EVENT = 'SELECT_EVENT';
export const DESELECT_EVENT = 'DESELECT_EVENT';

export function populateEvents(events) {
    return {
        type: POPULATE_EVENTS,
        events,
    }
}

export function selectEvent(selectedEvent) {
    return {
        type: SELECT_EVENT,
        selectedEvent,
    }
}

export function deselectEvent() {
    return {
        type: DESELECT_EVENT,
    }
}