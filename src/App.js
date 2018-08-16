import React, {Component} from 'react';
import {Button} from 'reactstrap';
import logo from './logo.svg';
import './App.css';
import './site.css';
import chaosIcon from './img/chaosIcon.png';
import exaltIcon from './img/exaltIcon.png';
import Nav from './components/Nav/Nav.js';
import BarChart from './components/BarChart/BarChart.js';
import { Route, Switch, Link } from 'react-router-dom';
import leaguesFile from './data/leagues.json';


class App extends Component {
    state = {
        currencyAboveOne: [],
        currencyBelowOne: [],
        leagues: [],
        selectedLeague: {name: "Hardcore Incursion", value: "Hardcore%20Incursion"},
        exaltPrice: 60,
        scaleValue: 1,
        dropDownOpen: false,
    }

    updateLeagues = () => {
        // fetch('./leagues.json')
        //   .then(response => JSON.parse(JSON.stringify(response.body.valueOf())))
        //   .then(result => {
        //       console.log('got leagues',result)
        //       this.setState({
        //           leagues: result,
        //       })
        //   })
        //   .catch(err => console.error(err));
        this.setState({
            leagues: JSON.parse(JSON.stringify(leaguesFile))
        })
    }
    updateData = () => {
        console.log("updating data", this.state.selectedLeague.label);
        let result;

        //fetch(`https://cors-anywhere.herokuapp.com/http://poe.ninja/api/data/currencyoverview?league=${this.state.selectedLeague.value}?type=Currency`,{"X-Requested-With": 'XMLHTTPRequest'})
        fetch(`https://cors-anywhere.herokuapp.com/https://poe.ninja/api/Data/GetCurrencyOverview?league=${this.state.selectedLeague.value}`)
          .then(response => response.json())
          .then(data => result = data)
          .then(() => {
              this.parseData(result);

              console.log('We have data:', this.state.currencyBelowOne);
          })
          .then(() => {
              this.render();
          })
          .catch(err => {
              console.log("League:", this.state.selectedLeague.label);
              console.log("It didn't work...", err);
          });
    }

    parseData = (data) => {
        let result = [];
        let overOneChaos = [];
        let belowOneChaos = [];

        let equivsOverOne = data.lines
          .filter(item => item.chaosEquivalent > 1)
          .map(item => item.chaosEquivalent);
        this.setState({
            scaleValue: Math.max(...equivsOverOne),
            exaltPrice: data.lines[data.lines.findIndex(currency => currency.currencyTypeName === 'Exalted Orb')].chaosEquivalent,
        });

        for (let item of data.lines) {
            let worth = (1 / item.chaosEquivalent).toFixed(2);
            let nearestTrade = this.nearestWholeTrade(item.chaosEquivalent);
            worth = (worth % 1 === 0) ? parseFloat(worth).toFixed(0) : worth;
            if(item.chaosEquivalent > 1) {
                overOneChaos.push({
                    name: item.currencyTypeName,
                    chaosEquivalent: item.chaosEquivalent,
                    worth: worth,
                    nearestWholeTrade0: nearestTrade[0],
                    nearestWholeTrade1: nearestTrade[1],
                    height: this.scaleRange(item.chaosEquivalent, this.state.scaleValue) + '%',
                    icon: data.currencyDetails[data.currencyDetails.findIndex(currency => currency.name === item.currencyTypeName)].icon
                })
            } else {
                belowOneChaos.push({
                    name: item.currencyTypeName,
                    chaosEquivalent: item.chaosEquivalent,
                    worth: worth,
                    nearestWholeTrade0: nearestTrade[0],
                    nearestWholeTrade1: nearestTrade[1],
                    height: this.scaleRange(item.chaosEquivalent, 1) + '%',
                    icon: data.currencyDetails[data.currencyDetails.findIndex(currency => currency.name === item.currencyTypeName)].icon
                })
            }
        }
        belowOneChaos.unshift({
            name: 'Chaos Orb',
            chaosEquivalent: 1,
            worth: 1,
            nearestWholeTrade0: 1,
            nearestWholeTrade1: 1,
            height: this.scaleRange(1, 1) + '%',
            icon: data.currencyDetails[0].icon
        });
        this.setState({
            currencyAboveOne: overOneChaos,
            currencyBelowOne: belowOneChaos,
            exaltIcon: "http://web.poecdn.com/image/Art/2DItems/Currency/CurrencyAddModToRare.png?scale=1&w=1&h=1",

        });
        return result;
    }

    switchLeague = (league) => {
        console.log('switching to league',league.label);
        this.setState({
            selectedLeague: league,
        })
        this.updateData();
    }

    scaleRange = (valueToScale, maxInRange) => { //Scales Number in Range r1 to Number in Range r2
        let r1 = [0, maxInRange];
        let r2 = [0, 100];
        return (valueToScale - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
    }

    nearestWholeTrade = (itemChaosEquiv) => {
        let product = 0, multiplier = 1;
        let result = [];
        product += itemChaosEquiv;
        while (product.toFixed(1) % 1 !== 0) {
            product += itemChaosEquiv;
            multiplier++;
        }
        product = Math.round(product);
        result.push(product);
        result.push(multiplier);
        return result;
    }

    removeBarItem = (itemName) => {
        let newRates = this.state.currency.slice();
        let removeIndex = newRates.findIndex(item => item.name === itemName);
        console.log("removing", newRates[removeIndex].name)
        newRates.splice(removeIndex, 1);
        let equivs = newRates.map(item => item.chaosEquivalent);
        let scaleValue = Math.max(...equivs);

        for (let item of newRates) {
            item.height = this.scaleRange(item.chaosEquivalent, scaleValue) + '%';
        }
        this.setState({
            currency: newRates,
            scaleValue: scaleValue,
        })

    }

    componentDidMount() {
        this.updateLeagues();
        this.updateData();
    }

    render() {
        return (
          <div className="container">
              <Nav
                leagues={this.state.leagues}
                switchLeague={(league) => this.switchLeague(league)}
                title={`Path of Exile Currency Rates in ${this.state.selectedLeague.label}`}
              />
              <BarChart
                currency={this.state.currencyBelowOne}
                removeBar={(name) => this.removeBarItem(name)}
                scaleValue={1}
                exaltPrice={this.state.exaltPrice}
              />
              <div>Currency Above 1 Chaos</div>
              <BarChart
                currency={this.state.currencyAboveOne}
                removeBar={(name) => this.removeBarItem(name)}
                scaleValue={this.state.scaleValue}
                exaltPrice={this.state.exaltPrice}
              />
          </div>
        );
    }
}

export default App;
