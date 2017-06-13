import React, { Component } from 'react'; 

class Invest extends Component{
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };
  }

  handleSuccess() {
    // we don't have a hook to know when everything is loaded, so will add a timeout for now to emulate a loading state.
    var timerId = setTimeout(() => {
      this.setState({ isLoading: false });
      clearTimeout(timerId);
    }, 1800);
  }

  handleError() {
    this.setState({ isLoading: false });
    alert('Failed to load script.');
  }

  componentWillMount() {
    const url = 'https://staging.fundpaas.com/widgets/invOn/widgetsLoader?businessId=B-938J79R5&offeringId=INVOFF-PRQGKU7ENICFR';
    const script = document.createElement('script');
    script.type = "text/javascript";
    script.onload = this.handleSuccess.bind(this);
    script.onerror = this.handleError.bind(this);
    script.src = url;
    script.async = true;
    document.body.appendChild(script);
  }

  render(){
    return (
      <div className='App__Container'>
        <div className="App__Invest">
          <h1 className={this.state.isLoading ? 'App__Loading-Message' : 'App__Loading-Message App__Component--Hidden'}>Launching Widget...</h1>
          <div className="fundpaas-widget-invOn__inlineContainer" data-offering-id="INVOFF-PRQGKU7ENICFR"></div>
        </div>
      </div>
    );
  }
}

export default Invest;