import React from 'react';
import DropDown from '../DropDown/DropDown.js';

const Nav = props => (
        <div className="nav" id="navbar">
            <div id="title">
                <a id="league-title">{props.title}</a>

                <span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Change League:
                    <DropDown
                        data={props.leagues.map(league => league.name)}
                        onToggle=""
                        optionSelected=""
                        isOpen={props.dropDownOpen}
                        onSelect=""
                    />
                    <select id="league" onChange={props.onChange}>
                    {props.leagues.map(league => (
                        <option value={league.value} selected={props.selected === league.value}>{league.name}</option>
                    ))}
                </select>
                </span>
            </div>
        </div>
    );

export default Nav;