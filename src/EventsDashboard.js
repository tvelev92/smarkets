import React, { Component } from 'react';
import SubEvent from './SubEvent'
import styled from 'styled-components'


const Container = styled.div`
    width: 100%
`;

const FlexMain = styled.div`
    background: #242424;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`

const Name = styled.h3`
    color: white;
`

export default class EventsDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
        }
    }

    fn = (event) => {
        return new Promise(resolve => {
            fetch(`https://cors-anywhere.herokuapp.com/api.smarkets.com/v3/popular/event_ids/sport/${event.slug}/`).then(res => res.json())
                .then(eventids => {
                    if(eventids.popular_event_ids.length === 0){
                        resolve(Object.assign({}, {event}, {events: []}))
                    }
                    const eventURL = 'https://cors-anywhere.herokuapp.com/api.smarkets.com/v3/events/?'
                    const test = eventids.popular_event_ids.map(id => `id=${id}`);
                    const test2 = test.join('&')
                    fetch(`${eventURL}${test2}`).then(res => res.json()).then(res => resolve(Object.assign({}, {event}, res)))
                })
        })
    }

    fetchPopularEventsPerSport = () => {
        const url = 'https://cors-anywhere.herokuapp.com/api.smarkets.com/v3/events/';
        fetch(url, {
            method: 'get',
        }).then(res => res.json()).then(res => {
            var test = res.events.map(this.fn)
            var results = Promise.all(test);
            results.then(res => this.setState({
                events: res,
            }))
        })
    }


    componentDidMount() {
        this.fetchPopularEventsPerSport()
    }

    event = (e, index) => {
        //console.log(e, index)
        return (
            <Container>
                <SubEvent event={e} key={index} />
            </Container>
        )
    }

    renderEvents = () => {
        
        return [
            ...this.state.events.filter(event => event.events.length), 
            ...this.state.events.filter(event => !event.events.length)].map(this.event)
    }

    render() {
        return (
            <FlexMain >
                {this.renderEvents()}
            </FlexMain >
        )
    }
}