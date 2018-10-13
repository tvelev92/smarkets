import React, { Component } from 'react';
import { connect } from 'react-redux';
import SubEvent from './SubEvent'
import styled from 'styled-components'
import { Icon, Button, Header, Image, Modal } from 'semantic-ui-react'

import {
    populateEvents,
    selectEvent,
    deselectEvent,
} from './data/actions/eventActions';


const Container = styled.div`
    width: 100%
`;

const FlexMain = styled.div`
    background: #000000;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`

const Name = styled.h3`
    color: white;
`

export class EventsDashboard extends Component {
    fn = (event) => {
        return new Promise(resolve => {
            fetch(`https://cors-anywhere.herokuapp.com/api.smarkets.com/v3/popular/event_ids/sport/${event.slug}/`).then(res => res.json())
                .then(eventids => {
                    if (eventids.popular_event_ids.length === 0) {
                        resolve(Object.assign({}, { event }, { events: [] }))
                    }
                    const eventURL = 'https://cors-anywhere.herokuapp.com/api.smarkets.com/v3/events/?'
                    const test = eventids.popular_event_ids.map(id => `id=${id}`);
                    const test2 = test.join('&')
                    fetch(`${eventURL}${test2}&sort=start_datetime%2Cid`).then(res => res.json()).then(res => resolve(Object.assign({}, { event }, res)))
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

    renderBetStatus = (event) => (color) => (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        }}>
            <div>
                <h3 style={{ color }}> {`Bet status: `} </h3>
            </div>
            <div style={{
                margin: '0em 1em',
            }}>
                <Icon color={`${event.bettable ? 'green' : 'red'}`} name={`${event.bettable ? 'unlock' : 'lock'}`} />
            </div>
        </div>
    )

    setSelectedEvent = (selectedEvent) => {
       this.props.selectEvent(selectedEvent)
    }

    nullifySelectedEvent = () => {
       this.props.deselectEvent();
    }


    componentDidMount() {
        this.fetchPopularEventsPerSport()
        setTimeout(() => this.fetchPopularEventsPerSport(), 10000)
    }

    event = (e, index) => {
        return (
            <Container key={index}>
                <SubEvent renderBetStatus={this.renderBetStatus} setSelectedEvent={this.setSelectedEvent} event={e} />
            </Container>
        )
    }

    renderEvents = () => {
        return [
            ...this.props.events.filter(event => event.events.length),
            ...this.props.events.filter(event => !event.events.length)].map(this.event)
    }

    renderModalHeader = (selectedEvent) => (
        <Modal.Header>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
            }}>
                <div>
                    <h1> {selectedEvent.short_name || selectedEvent.name}</h1>
                </div>
                <div style={{ position: 'absolute', top: 0, right: 0 }}>
                    <div
                        onClick={this.nullifySelectedEvent}
                    >
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
        console.debug(selectedEvent)
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
            <FlexMain>
                {this.renderEvents()}
                <Modal
                    open={!!selectedEvent}
                >
                    {!!selectedEvent && this.renderModalHeader(selectedEvent)}
                    {!!selectedEvent && this.renderModalContent(selectedEvent)}
                </Modal>
            </FlexMain>
        )
    }
}

const mapStateToProps = (state) => ({
    events: state.eventReducer.get('events'),
    selectedEvent: state.eventReducer.get('selectedEvent')
})

const mapDispatchToProps = {
    populateEvents,
    selectEvent,
    deselectEvent,
}

export default connect(mapStateToProps, mapDispatchToProps)(EventsDashboard)