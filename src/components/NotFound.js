import React, { Component } from 'react';
import { Link } from 'react-router';

class NotFound extends Component{
  render(){
    return (
      <div className='App__Container'>
        <div className="App__NotFound">
          <h1>Whoops!</h1>
          <p>Seems like you ended up in the wrong place</p>
          <p><Link to='/'>Click here</Link> to go back</p>
        </div>
      </div>
    );
  }
}

export default NotFound;