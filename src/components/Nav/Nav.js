import React from 'react';
import Select from 'react-select';
import chroma from 'chroma-js';
import './Nav.css';

const dot = (color = '#ccc') => ({
    alignItems: 'center',
    display: 'flex',

    ':before': {
        backgroundColor: color,
        borderRadius: 10,
        content: ' ',
        display: 'block',
        marginRight: 8,
        height: 10,
        width: 10,
    },
});

const Nav = props => (
        <div className="nav" id="navbar">
            <div id="title">
                <a id="league-title">{props.title}</a>
            </div>
            <div id="nav--select-container">
                    Change League:
                    <Select
                      classNamePrefix="nav--select"
                      options={props.leagues}
                      onChange={(newval) => {props.switchLeague(newval)}}
                    />

            </div>
        </div>
    );

export default Nav;