import React from 'react';
import OwnerEventListItem from './OwnerEventListItem.jsx'

const OwnerEventList = (props) => (
  <div className='eventlist container-fluid'>
    {props.ownerEventsArr.map((event, i) => <OwnerEventListItem accessToken={props.accessToken} key={i}event={event}/>)}  
  </div>
)
export default OwnerEventList;


