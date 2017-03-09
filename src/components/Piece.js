import React from 'react';
import "../styles/Piece.css";


export default function Piece ( props ) {
  const classes = [
    "piece",
    "piece--" + props.color,
    "piece--" + props.pieceType,
  ];

  if ( props.selected ) {
    classes.push( "selected" );
  }

  if ( props.demo ) {
    classes.push( "piece--demo" );
  }
  
  return (
    <div className={classes.join(" ")} style={props.styles} />
  );
}

Piece.propTypes = {
  color: React.PropTypes.string.isRequired,
  pieceType: React.PropTypes.string.isRequired,
  selected: React.PropTypes.bool,
  styles: React.PropTypes.object,
};


