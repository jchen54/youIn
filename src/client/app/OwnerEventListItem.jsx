import React from 'react';
import OwnerDetailedView from './OwnerDetailedView.jsx';
import moment from 'moment';
import $ from 'jquery';
import GoogleCalendar from './GoogleCalendar.jsx';
import _ from 'lodash';

class OwnerEventListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
      result: '5',
      votes: []
    }
    this.handleClickListItem = this.handleClickListItem.bind(this);
    this.handleVotes = this.handleVotes.bind(this);
    this.setResult = this.setResult.bind(this);
  }

  componentDidMount() {
    this.handleVotes();
  }

  handleClickListItem() {
    this.setState({clicked: !this.state.clicked});
    if (this.state.clicked) {
      this.props.getEvents(this.props.history, function(result) {
        this.setState({
          ownerEvents: result.ownerEvents,
          friendEvents: result.friendEvents
        });
      });
    }
  }

  handleVotes() {
    $.ajax({
      url: '/dates',
      method: 'GET',
      success: (data) => {
        console.log('Success handleVotes', data)
        this.setState({
          votes: data
        }, () => {
          console.log('hello', this.state.votes);
        })
      },
      error: (err) => {
        console.log('STATUS CHECK FAILED: ', err);
      }
    })
  }

  setResult(event) {
    event.preventDefault();
    var largestCount = _.maxBy(this.state.votes, function(vote) { return vote.count; });
    var resultDate = new Date(largestCount.date).toISOString();
    this.setState({result: resultDate}, () => {
      this.setState({result: this.state.result});
    });
  }

  render() {
    let date = moment(this.props.event.date);

    return (
      <div>
        <div className="panel list-item row" onClick={this.handleClickListItem}>
          <div className="glyphicon glyphicon-globe col-sm-1"></div>
          <div className="col-sm-4">{this.props.event.title}</div>
          <div className="col-sm-4">
            <div>
              { this.state.votes &&
                this.state.votes.map((vote, i) => (
                  <li key={i} value={new Date(vote.date).toDateString()} onClick={this.setResult}>{new Date(vote.date).toDateString()}: {vote.count}</li>
                ))}
            </div>

          </div>
          <div className="col-sm-3">{this.props.event.attendees.length}<span> people IN</span></div>
          <br/>
        </div>
        <p>Click to send Google Calendar Invite to all event participants</p>
        <GoogleCalendar event={this.props.event} friends={this.props.friends} result={this.state.result}/>
        <OwnerDetailedView eventId = {this.props.event.event_id} accessToken={this.props.accessToken} event={this.props.event}/>      </div>
    );
  }
}

export default OwnerEventListItem;
