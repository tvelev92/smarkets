import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Modal, Loader } from 'semantic-ui-react'
import './styles/EventsDashboard.css';
import EventGroup from './EventGroup'
import styled from 'styled-components'

import {
    populateEvents,
    selectEvent,
    deselectEvent,
} from './data/actions/eventActions';

import {
    toggleLoader
} from './data/actions/loaderActions';


export class EventsDashboard extends Component {
    fn = (event) => {
        return new Promise(resolve => {
            fetch(`https://cors-anywhere.herokuapp.com/api.smarkets.com/v3/popular/event_ids/sport/${event.slug}/`).then(res => res.json())
                .then(eventids => {
                    if (eventids.popular_event_ids.length === 0) {
                        resolve(Object.assign({}, { event }, { events: [] }))
                    }
                    const eventURL = 'https://cors-anywhere.herokuapp.com/api.smarkets.com/v3/events/?'
                    const idStrings = eventids.popular_event_ids.map(id => `id=${id}`);
                    const idString = idStrings.join('&')
                    fetch(`${eventURL}${idString}&sort=start_datetime%2Cid`).then(res => res.json()).then(res => {
                        resolve(Object.assign({}, { event }, res))
                        this.props.loader && this.props.toggleLoader();
                    })
                })
        })
    }

    fetchPopularEventsPerSport = () => {
        const url = 'https://cors-anywhere.herokuapp.com/api.smarkets.com/v3/events/';
        try {
            fetch(url, {
                method: 'get',
            }).then(res => res.json()).then(res => {
                var test = res.events.map(this.fn)
                var results = Promise.all(test);
                results.then(res => this.props.populateEvents(res))
            })
        } catch (e) {
            console.debug(e);
        }
    }

    renderBetStatus = (event) => (color) => {
        const { bettable } = event;
        return (
            <div className='betStatus'>
                <div>
                    <h3 style={{ color }}> {`Bet status: `} </h3>
                </div>
                <div style={{
                    margin: '0em 1em',
                }}>
                    <Icon
                        color={`${bettable ? 'green' : 'red'}`}
                        name={`${bettable ? 'unlock' : 'lock'}`}
                    />
                </div>
            </div>
        )
    }
    setSelectedEvent = (selectedEvent) => {
        this.props.selectEvent(selectedEvent)
    }

    nullifySelectedEvent = () => {
        this.props.deselectEvent();
    }


    componentDidMount() {
        this.props.toggleLoader()
        this.fetchPopularEventsPerSport()
        setTimeout(() => this.fetchPopularEventsPerSport(), 10000)
    }

    event = (e, index) => {
        return (
            <div
                className='eventGroupContainer'
                key={index}
            >
                <EventGroup renderBetStatus={this.renderBetStatus} setSelectedEvent={this.setSelectedEvent} event={e} />
            </div>
        )
    }

    renderEvents = () => {
        return [
            ...this.props.events.filter(event => event.events.length),
            ...this.props.events.filter(event => !event.events.length)].map(this.event)
    }

    renderModalHeader = (selectedEvent) => (
        <Modal.Header>
            <div className='modalHeader'>
                <div>
                    <h1> {selectedEvent.short_name || selectedEvent.name}</h1>
                </div>
                <div style={{ position: 'absolute', top: 0, right: 0 }}>
                    <div onClick={this.nullifySelectedEvent}>
                        <Icon
                            color='red'
                            name='close'
                            size='large'
                            link
                        />
                    </div>
                </div>
            </div>
        </Modal.Header>
    )

    renderModalContent = (selectedEvent) => {
        return (< Modal.Content >
            <div><p> {selectedEvent.startTimeString} </p>
                {this.renderBetStatus(selectedEvent)('purple')}
            </div>
        </Modal.Content >
        )
    }

    render() {
        const { selectedEvent } = this.props;
        return (
            <div className='mainContainer'>
                {this.renderEvents()}
                <Modal
                    open={!!selectedEvent} //expects boolean prop
                >
                    {selectedEvent && this.renderModalHeader(selectedEvent)}
                    {selectedEvent && this.renderModalContent(selectedEvent)}
                </Modal>
                <Loader active={this.props.loader}>Loading</Loader>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    events: state.eventReducer.get('events'),
    selectedEvent: state.eventReducer.get('selectedEvent'),
    loader: state.loader.get('loader'),
})

const mapDispatchToProps = {
    populateEvents,
    selectEvent,
    deselectEvent,
    toggleLoader,
}

export default connect(mapStateToProps, mapDispatchToProps)(EventsDashboard)