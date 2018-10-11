import React, { Component } from 'react';
import styled from 'styled-components'
import moment from 'moment';
import _ from 'lodash';
import { Icon } from 'semantic-ui-react'


const Container = styled.div`
    width: 100%
`;

const EventBox = styled.div`
     border: 2px solid palevioletred;
     display: flex;
     width: 80%;
     flex-direction: row;
     margin: 1em 1em;
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
     border: 2px solid red;
     margin: 2em;
     border-radius: 3px;
     &:hover {
       border: 2px solid white;
    }
`

const Title = styled.h1`

`

export default class SubEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popularEvents: [],
        }
    }


    componentDidMount() {

    }

    getTime = (event) => {
        if (event.end_date) {
            return 'Event has concluded';
        }

        const date = new Date(event.start_datetime);
        if (date.getTime() < moment().format('x')) {
            return 'Currently Happening'
        }

        return `Starts in: ${moment.unix(date.getTime() / 1000).utc().fromNow()}`
    }

    sortEvents(a, b) {
        console.debug(a, b)
        const dateA = new Date(a.start_datetime);
        const dateB = new Date(b.start_datetime)
        console.debug(dateA.getDate(), dateB)
        return dateB.getDate() - dateA.getDate();
    }

    renderEventBox = () => {
        const myOrderedArray = _.sortBy(this.props.event.events, event => new Date(event.start_datetime).getTime())
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
                                    const date = new Date(event.start_datetime);
                                    return (
                                        <SubTwo onClick={() => { console.log('clicked') }}>
                                            <div style={{
                                                display: 'flex',
                                                margin: '0em 1em',
                                                flexDirection: 'column',
                                            }}>
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <div>
                                                        <h3 style={{ color: 'white' }}>
                                                            {event.short_name || event.name}
                                                        </h3>
                                                    </div>
                                                    <div>
                                                        <h3 style={{ color: 'white' }}> {this.getTime(event)} </h3>
                                                    </div>
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    alignItems: 'center'
                                                }}>
                                                    <div>
                                                        <h3 style={{ color: 'white' }}> {`Bet status: `} </h3>
                                                    </div>
                                                    <div style = {{
                                                        margin: '0em 1em',
                                                    }}>
                                                        <Icon color={`${event.bettable ? 'green' : 'red'}`} name={`${event.bettable ? 'unlock' : 'lock'}`} />
                                                    </div>
                                                </div>
                                            </div>
                                        </SubTwo>
                                    )
                                })}
                        </Test>
                    ) : (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    textAlign: 'center',
                                }}
                            >
                                <h3> {'Nothing Scheduled'} </h3>
                            </div>
                        )
                    }
                </Sub>
            </EventBox >
        )
    }
    render() {
        console.log(this.props.event)
        return (
            this.renderEventBox()
        )
    }

}
