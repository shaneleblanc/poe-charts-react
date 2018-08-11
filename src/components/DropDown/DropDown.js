import React from 'react';

const DropDown = (props) => (
  <div className='dropdown'>
      <button onClick={props.onToggle}>
          Selected option: {props.data[props.optionSelected]}
      </button>
      <ul className={props.isOpen ? 'active':null}>
          {
              props.data.map((item, i) => {
                  return (
                    <li key={i} className={i === props.optionSelected ? 'selected':null}
                        onClick={() => props.onSelect(i)}>
                        {item}
                    </li>
                  )
              })
          }
      </ul>
  </div>
);

export default DropDown;