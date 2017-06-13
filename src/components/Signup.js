import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import { isEmpty } from 'lodash';

class Signup extends Component{
  constructor(props) {
    super(props);
    this.state = {
      fileName: "",
      errorMessage: "",
      isLoading: false
    };
  }

  handleFileChange(e) {
    if(e.target.files.length) {
      this.setState({ fileName: e.target.files[0].name });
    }else {
      this.setState({ fileName: '' });
    }
  }

  handleFormSubmit(e) {
    e.preventDefault();
    var validationMessage = '';
    var formEl = document.forms.signupForm;
    var formData = new FormData(formEl);

    var payloadData = new FormData();
    var investor = {
      investorType: "PA",
      address: {
        country: "US"
      },
      deviceFingerprint: "API-I-KScsbfEApVYWfvQXvYgK"
    };

    formData.forEach((value, key) => {
      if(isEmpty(value) && isEmpty(validationMessage)) {
        var element = document.getElementById(key);
        if(key === 'driversLicense') {
          if(!value.name) {
            validationMessage = element.dataset.label + ' is required';
          }
        }else {
          if(element.dataset.label) {
            validationMessage = element.dataset.label + ' is required';
          }
        }

      }

      switch(key) {
        case 'username':
        case 'password':
        case 'firstName':
        case 'lastName':
        case 'phoneNumber':
        case 'ssn':
          investor[key] = value;
          break;
        case 'dob':
          var dob = value.split('-').map(num => +num);
          if(dob.length === 3) {
            investor[key] = dob.map(num => +num);
          }else {
            // need to fix validation on api side to handle bad input like [0,0,0]
            investor[key] = [1500,1,1];
          }
          break;
        case 'driversLicense':
          payloadData.append("DrLcn", value);
          break;
        case 'investmentAmount':
          break;
        default:
          investor.address[key] = value;
          break;
      }
    });

    payloadData.append("investor", JSON.stringify(investor));
    
    if(!validationMessage) {
      var sId = null;
      this.setState({
        isLoading: true
      });
      // can do call client api here before fundpaas api
      fetch('https://staging.fundpaas.com/api/logins/signups/investors', {
        method: 'POST',
        body: payloadData
      })
      .then(status => {
        status.headers.forEach((value, key) => {
          if(key === 'fundpaas.sidn') {
            sId = value;
          }
        });
        
        return status.json();
      })
      .then((response) => {
        console.log(response);
        if(response.responseCode.startsWith('2')) {
          localStorage.setItem('FUNDPAAS.lId', response.loginId);
          localStorage.setItem('FUNDPAAS.lTy', response.loginType);
          localStorage.setItem('FUNDPAAS.pId', response.personId);
          localStorage.setItem('FUNDPAAS.sId', sId);
          localStorage.setItem('FUNDPAAS.sIT', 'P');

          browserHistory.push('/invest');
        }else {
          this.setState({
            errorMessage: response.customerMessage,
            isLoading: false
          });
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          errorMessage: 'Failed to sent data. Please contact support.',
          isLoading: false
        });
      });
    }else {
      this.setState({
        errorMessage: validationMessage,
        isLoading: false
      });
    }
  }

  render(){
    return (
      <div className='App__Container'>
        <form className="App__Signup" id='signupForm' onSubmit={this.handleFormSubmit.bind(this)}>
          <h1>Signup</h1>
          <hr />
          <div className={this.state.errorMessage ? 'App__Notification' : ''}>{this.state.errorMessage}</div>
          <table className="App__Signup__Form">
            <thead className='App__Signup__Form__Instructions'>
              <tr>
               <td colSpan={2}><div></div>Required fields</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <label htmlFor="username">Personal email</label>
                  <input type="email" name="username" id="username" data-label='Personal email' />
                </td>
                <td>
                  <label htmlFor="password">Password</label>
                  <input type="password" name="password" id="password" data-label='Password' />
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td>
                  <label htmlFor="firstName">First name</label>
                  <input type="text" name="firstName" id="firstName" data-label='First name' />
                </td>
                <td>
                  <label htmlFor="lastName">Last name</label>
                  <input type="text" name="lastName" id="lastName" data-label='Last name' />
                </td>
              </tr>

              <tr>
                <td>
                  <label htmlFor="phoneNumber">Personal phone</label>
                  <input type="tel" name="phoneNumber" id="phoneNumber" data-label='Personal phone' placeholder="+1 000-000-0000" />
                </td>
                <td className='App__Signup__Form__Col--2'>
                  <div>
                    <label htmlFor="dob">Date of birth</label>
                    <input type="date" name="dob" id="dob" data-label='Date of birth' className='App__Signup__Form__Col--2--Shift' />                    
                  </div>
                  <div>
                    <label htmlFor="ssn">SSN (Last 4 Digits)</label>
                    <input type="text" name="ssn" id="ssn" data-label='SSN' />
                  </div>
                </td>
              </tr>

              <tr>
                <td colSpan={2}>
                  <label htmlFor="streetAddress1">Personal address</label>
                  <input type="text" name="streetAddress1" id="streetAddress1" data-label='Personal address' placeholder="e.g. 123 Main St" />
                </td>
              </tr>

              <tr>
                <td colSpan={2}>
                  <input type="text" name="streetAddress2" id="streetAddress2" placeholder="e.g. Suite 101" />
                </td>
              </tr>

              <tr>
                <td>
                  <div>
                    <label htmlFor="city">City</label>
                    <input type="text" name="city" id="city" data-label='City' />
                  </div>
                  <div className='App__Signup__Form__Col--2--Clearfix'>
                    <div>
                      <label htmlFor="usState">State</label>
                      <select name="usState" id="usState" data-label='State' className='App__Signup__Form__Col--2--Shift'>
                        <option selected disabled value=""></option><option value="AL">AL</option><option value="AK">AK</option><option value="AZ">AZ</option><option value="AR">AR</option><option value="CA">CA</option><option value="CO">CO</option><option value="CT">CT</option><option value="DE">DE</option><option value="DC">DC</option><option value="FL">FL</option><option value="GA">GA</option><option value="HI">HI</option><option value="ID">ID</option><option value="IL">IL</option><option value="IN">IN</option><option value="IA">IA</option><option value="KS">KS</option><option value="KY">KY</option><option value="LA">LA</option><option value="ME">ME</option><option value="MD">MD</option><option value="MA">MA</option><option value="MI">MI</option><option value="MN">MN</option><option value="MS">MS</option><option value="MO">MO</option><option value="MT">MT</option><option value="NE">NE</option><option value="NV">NV</option><option value="NH">NH</option><option value="NJ">NJ</option><option value="NM">NM</option><option value="NY">NY</option><option value="NC">NC</option><option value="ND">ND</option><option value="OH">OH</option><option value="OK">OK</option><option value="OR">OR</option><option value="PA">PA</option><option value="RI">RI</option><option value="SC">SC</option><option value="SD">SD</option><option value="TN">TN</option><option value="TX">TX</option><option value="UT">UT</option><option value="VT">VT</option><option value="VA">VA</option><option value="WA">WA</option><option value="WV">WV</option><option value="WI">WI</option><option value="WY">WY</option><option value="AS">AS</option><option value="GU">GU</option><option value="MP">MP</option><option value="PR">PR</option><option value="VI">VI</option><option value="FM">FM</option><option value="MH">MH</option><option value="PW">PW</option><option value="AA">AA</option><option value="AE">AE</option><option value="AP">AP</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="postalCode">Zip code</label>
                      <input type="text" name="postalCode" id="postalCode" data-label='Zip code' />
                    </div>
                  </div>
                </td>
                <td className='App__Signup__Form__Investment-Amount'>
                  <label className='App__Signup__Form__Investment-Amount__Title'>Investment Amount</label>
                  <div className='App__Signup__Form__Col--3--Clearfix App__Signup__Form__Badge'>
                   <div>
                     <input type="radio" id='gold' name="investmentAmount" value="500" /> 
                     <label htmlFor='gold' className='App__Signup__Form__Badge--Gold'>
                       <span>$500</span>
                     </label>
                   </div>
                   <div>
                     <input type="radio" id='silver' name="investmentAmount" value="200" /> 
                     <label htmlFor='silver' className='App__Signup__Form__Badge--Silver'>
                       <span>$200</span>
                     </label>
                   </div>
                   <div>
                     <input type="radio" id='bronze' name="investmentAmount" value="100" /> 
                     <label htmlFor='bronze' className='App__Signup__Form__Badge--Bronze'>
                       <span>$100</span>
                     </label>
                   </div>
                  </div>
                </td>
              </tr>
    
              <tr className='App__Signup__Form__Upload-File'>
                <td colSpan={2}>
                  <label>Driver's license</label>
                  <label>
                    <input type="file" 
                           name="driversLicense" 
                           id="driversLicense" 
                           data-label="Driver's license"
                           onChange={this.handleFileChange.bind(this)}/>
                    <div>Choose file</div>
                    <span>{this.state.fileName}</span>
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="App__Signup__Form__Button-Group">
            <Link to='/'>
              <button>Back</button>
            </Link>
            <button type='submit'>Continue</button>
          </div>
        </form>
        <div className={this.state.isLoading ? 'App__Spinner' : 'App__Component--Hidden'}></div>
        <div className={this.state.isLoading ? 'App__Overlay' : 'App__Component--Hidden'}>
          <p>This process will take a few minutes, please do not close the browser.</p>
        </div>
      </div>
    );
  }
}

export default Signup;