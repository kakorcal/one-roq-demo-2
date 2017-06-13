import React, { Component } from 'react';
import { Link } from 'react-router';
import { ResponsiveImage, ResponsiveImageSize } from 'react-responsive-image';

class Main extends Component{
  render(){
    return (
      <div className='App__Container'>
        <div className='App__Hero'>
          <div className="App__Hero-Banner-Group">
            <ResponsiveImage>
              <ResponsiveImageSize
                default
                minWidth={0}
                path={'./assets/images/main.jpg'}
              />
              <ResponsiveImageSize
                minWidth={1200}
                path={'./assets/images/banner.png'}
              />
            </ResponsiveImage>
            <div className='App__Hero__Button-Group'>              
              <a href="https://www.facebook.com/oneroq/" 
                 rel="noopener noreferrer"
                 target='_blank'>
                 <button className='App__Button'>LEARN MORE</button>
              </a>
              <Link to='/signup'>
                <button className='App__Button'>INVEST</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;