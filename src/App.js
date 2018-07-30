import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './site.css';

class App extends Component {
  state = {
      currency: [],
      league: 'tmphardcore',
      exaltPrice: 60,
      scaleValue: 1,

    }

  updateData = () => {
    console.log("updating data",this.state.league);
    let result;

    fetch(`https://cors-anywhere.herokuapp.com/https://poe.ninja/api/Data/GetCurrencyOverview?league=${this.state.league}`)
      .then(response => response.json())
      .then(data => result = data)
      .then(() => {
        this.setState({
          currency: this.parseData(result),
          exaltIcon: "http://web.poecdn.com/image/Art/2DItems/Currency/CurrencyAddModToRare.png?scale=1&w=1&h=1",

    });

      console.log('We have data:',this.state.currency)
      this.render();
      console.log(this.state.currency);

    })
      .catch(err => {
        console.log("League:",this.state.league);
        console.log("It didn't work...", err);
      });
  }

  parseData = (data) => {
    let result = [];
    let equivs = data.lines.map(item => item.chaosEquivalent);
    this.setState({
      scaleValue: Math.max(...equivs),
      exaltPrice: data.lines[data.lines.findIndex(currency => currency.currencyTypeName === 'Exalted Orb')].chaosEquivalent,
});
    for(let item of data.lines){
      let worth = (1 / item.chaosEquivalent).toFixed(2);
      let nearestTrade = this.nearestWholeTrade(item.chaosEquivalent);
      console.log(nearestTrade[0]);
      worth = (worth % 1 === 0) ? parseFloat(worth).toFixed(0) : worth;
      console.log(data);
      console.log('trying',item);
      result.push({
        name: item.currencyTypeName,
        chaosEquivalent: item.chaosEquivalent,
        worth: worth,
        nearestWholeTrade0: nearestTrade[0],
        nearestWholeTrade1: nearestTrade[1],
        height: this.scaleRange(item.chaosEquivalent) + '%',
        icon: data.currencyDetails[data.currencyDetails.findIndex(currency => currency.name === item.currencyTypeName)].icon
      })
    }
    result.unshift({ name: 'Chaos Orb',
                     chaosEquivalent: 1,
                     worth: 1,
                     nearestWholeTrade0: 1,
                     nearestWholeTrade1: 1,
                     height: this.scaleRange(1) + '%',
                     icon: data.currencyDetails[0].icon});

    return result;
  }
  switchLeague = () => {

  }
  nearestWholeTrade = (itemChaosEquiv) => {
    let product = 0, multiplier = 1;
    let result = [];
    product += itemChaosEquiv;
    while(product.toFixed(1) % 1 !== 0){
      product += itemChaosEquiv;
      multiplier++;
    }
    product = Math.round(product);
    result.push(product);
    result.push(multiplier);
    return result;
  }
  scaleRange = (value) => { //Scales Number in Range r1 to Number in Range r2
      let r1 = [0, this.state.scaleValue];
      let r2 = [0, 100];
      return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
  }

  componentDidMount() {

    this.updateData();
  }
  render() {
    return (
      <div className="container">
      <div className="nav" id="navbar">
        <div id="title">
        <a id="league-title">Path of Exile Currency Rates in Incursion Hardcore</a>

                  <span>

                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                Change League: <select id="league" onchange="{this.switchLeague}">
                  <option value="tmphardcore" selected="selected">Incursion Hardcore</option>
                  <option value="Incursion">Incursion</option>
                  <option value="Standard">Standard</option>
                  <option value="Hardcore">Hardcore</option>
                </select>
                </span>
    </div>
  </div>
      <div className="BarGraph" id="chart">
        {this.state.currency.map(item =>

          (<div className="BarGraph-bar" key={item.name} style={{height : item.height}}>
          <div className="infoline">{item.name} <br /> {item.worth}:1c <img src={item.icon} alt={item.name} /> </div>
        <div className="infoline">{item.nearestWholeTrade1} <img src={item.icon} width="32" height="32" /> = {item.nearestWholeTrade0} <img src={this.state.currency[0].icon} width="32" height="32" /></div> <br />
          <div className="infoline">10 <img src={this.state.currency[0].icon} width="32" height="32" /> = {Math.round(10 / item.chaosEquivalent)} <img src={item.icon} width="32" height="32" /></div> <br />
          <div className="infoline">1&nbsp;&nbsp; <img src={this.state.exaltIcon} width="32" height="32" /> = {Math.round(this.state.exaltPrice * item.worth)} <img src={item.icon} width="32" height="32" /></div>
          </div>
      ))}

      </div>
      <div className="BarGraph" id="underneath">
      </div>
    </div>
    );
  }
}

export default App;
