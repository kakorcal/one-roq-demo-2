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
            {/* fmb */}
              <Link to='/signup'>
                <button className='App__Button'>INVEST</button>
              </Link>
             {/*<button className='App__Button'>INVEST</button>*/}
            </div>
          </div>
        </div>
        {/* inline */}
        {/*
        <div className="App__Inline-FMB">
          <div className="fundpaas-widget-invOn__inlineContainer" data-offering-id="INVOFF-7QQFGEJINNUK2"></div>
        </div>
        */}
      </div>
    );
  }
}

export default Main;