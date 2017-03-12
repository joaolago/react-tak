import React from 'react';
import "../styles/Intro.css";


export default function Intro ( props ) {
  const on3Clicked = () => {
    props.onSizeSelected(3);
  };

  const on4Clicked = () => {
    props.onSizeSelected(4);
  };

  const on5Clicked = () => {
    props.onSizeSelected(5);
  };

  return (
    <div className="intro">
      <h1>TAK</h1>
      <p>Start new game:</p>
      <div className="menu">
        <a className="menu__item" onClick={on3Clicked}>3x3</a>
        <a className="menu__item" onClick={on4Clicked}>4x4</a>
        <a className="menu__item" onClick={on5Clicked}>5x5</a>
      </div>
    </div>
  );
}
