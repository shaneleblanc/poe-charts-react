import chaosIcon from "../../img/chaosIcon.png";
import exaltIcon from "../../img/exaltIcon.png";
import React from "react";
import './BarChart.css';

const BarChart = props =>
(<div>
    <div className="BarGraph" id="chart">
        {props.currency.map(item =>

            (<div className="BarGraph-bar" key={item.name} style={{height : item.height}}>
                    <div className="BarGraph-bar-title">{item.name} <br /> {item.worth}:1c <img src={item.icon} alt={item.name} /> </div>
                    <div className="BarGraph-bar-info">{item.nearestWholeTrade1} <img src={item.icon} width="32" height="32" /> = {item.nearestWholeTrade0} <img src={chaosIcon} width="32" height="32" /></div>
                    <div className="BarGraph-bar-info">10 <img src={chaosIcon} width="32" height="32" /> = {Math.round(10 / item.chaosEquivalent)} <img src={item.icon} width="32" height="32" /></div>
                    <div className="BarGraph-bar-info">1&nbsp;&nbsp; <img src={exaltIcon} width="32" height="32" /> = {Math.round(props.exaltPrice * item.worth)} <img src={item.icon} width="32" height="32" /></div>
                    <div className="BarGraph-bar-info"><button color="info" onClick={() => props.removeBar(item.name)}>Remove</button></div>
                </div>
            ))}

    </div>
    <div className="BarGraph" id="underneath">
    </div>
</div>);

export default BarChart;