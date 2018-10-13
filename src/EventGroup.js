import React, { Component } from 'react';
import styled, { keyframes } from 'styled-components'
import moment from 'moment';
import _ from 'lodash';
import { Icon } from 'semantic-ui-react'
import { fadeIn } from 'react-animations';
import './styles/EventGroup.css';

const liveEvent = 'Currently Happening';

const SubTwo = styled.div`
     background: #242424;
     margin: 1em 1em;
     border-radius: 3px;
     border: 1px solid #242424;
     &:hover {
       border: 1px solid white;
    }
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
        <div className='nameTimeContainer'>
            <div>
                <h3 className='whiteText'>
                    {event.short_name || event.name}
                </h3>
            </div>
            <div>
                <div className='rowFlexCenter'>
                    {this.getTime(event) === liveEvent && <LiveEvent />}
                    <div>
                        <h3 className='whiteText'> {this.getTime(event)} </h3>
                    </div>
                </div>
            </div>
        </div>
    )

    renderNoScheduledEvent = () => (
        <div className='colFlexCenter'
        >
            <h3 className='whiteText'> {'Nothing Scheduled'} </h3>
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
            <div className='eventBox'>
                <div className='columnFlex'>
                    <div className='colFlexCenter'>
                        <h1 className = 'whiteText'> {this.props.event.event.name} </h1>
                    </div>
                    {!!this.props.event.events.length ? (
                        <div>
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
                        </div>
                    ) : this.renderNoScheduledEvent()
                    }
                </div>
            </div>
        )
    }
    render() {
        return (
            this.renderEventBox()
        )
    }

}
