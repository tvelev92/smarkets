import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components'
import moment from 'moment';
import _ from 'lodash';
import { Icon } from 'semantic-ui-react'
import { fadeIn } from 'react-animations';

const liveEvent = 'Currently Happening';
const EventBox = styled.div`
     border: 2px solid palevioletred;
     display: flex;
     width: 80%;
     flex-direction: row;
     margin: 0.5em 1em;
`

const Sub = styled.div`
    flex-direction: column;
    flex: 1;
`

const Test = styled.div`
    flex-direction: column;
    width: 100%;
`

const SubTwo = styled.div`
     background: #242424;
     margin: 1em 1em;
     border-radius: 3px;
     border: 1px solid #242424;
     &:hover {
       border: 1px solid white;
    }
`

const NameTimeRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const fader = keyframes`${fadeIn}`;

const LiveEvent = styled.div`
    animation: 1s ${fader} alternate infinite;
    background: #339933;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin: 0em 1em;
`

const Title = styled.h1`
    color: white;
`

export default class SubEvent extends Component {
    getTime = (event) => {
        if (event.end_date) {
            return 'Event has concluded';
        }

        const date = new Date(event.start_datetime);
        if (date.getTime() < moment().format('x')) {
            return liveEvent;
        }

        return `Starts in: ${moment.unix(date.getTime() / 1000).utc().fromNow()}`
    }

    sortEvents(a, b) {
        const dateA = new Date(a.start_datetime);
        const dateB = new Date(b.start_datetime)
        return dateB.getDate() - dateA.getDate();
    }



    renderNameTime = (event) => (
        <NameTimeRow>
            <div>
                <h3 style={{ color: 'white' }}>
                    {event.short_name || event.name}
                </h3>
            </div>
            <div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    {this.getTime(event) === liveEvent && <LiveEvent />}
                    <div>
                        <h3 style={{ color: 'white' }}> {this.getTime(event)} </h3>
                    </div>
                </div>
            </div>
        </NameTimeRow>
    )

    renderNoScheduledEvent = () => (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center',
            }}
        >
            <h3 style={{ color: 'white' }}> {'Nothing Scheduled'} </h3>
        </div>
    )

    renderEventBox = () => {
        /*
        initally I had issues sorting via the api on line 46 of EventsDashboard I was trying to append '&sort=start_datetime'
        but that was resulting in 404's. Tried copying what the 'try it' function on the api docs generates and that sorted for me 
        on the server side.. left  the front end sorting to demonstrate use of lodash
        */
        //const myOrderedArray = _.sortBy(this.props.event.events, event => new Date(event.start_datetime).getTime())
        const myOrderedArray = this.props.event.events;
        return (
            <EventBox>
                <Sub>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            textAlign: 'center',
                        }}
                    >
                        <Title> {this.props.event.event.name} </Title>
                    </div>
                    {!!this.props.event.events.length ? (
                        <Test>
                            {
                                myOrderedArray.map((event, i) => {
                                    return (
                                        <SubTwo key={event.id}
                                            onClick={() => this.props.setSelectedEvent(
                                                Object.assign({}, event, { startTimeString: this.getTime(event) })
                                            )}>
                                            <div style={{
                                                display: 'flex',
                                                margin: '0em 1em',
                                                flexDirection: 'column',
                                            }}>
                                                {this.renderNameTime(event)}
                                                {this.props.renderBetStatus(event)('white')}
                                            </div>
                                        </SubTwo>
                                    )
                                })}
                        </Test>
                    ) : this.renderNoScheduledEvent()
                    }
                </Sub>
            </EventBox >
        )
    }
    render() {
        return (
            this.renderEventBox()
        )
    }

}
