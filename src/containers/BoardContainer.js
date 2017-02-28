import React, { Component } from 'react';
import Spot from "../containers/SpotContainer";

class BoardContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pieceOnHand: null,
    };
  }

  onPieceClicked(position, grabbedPiece) {
    if ( this.state.pieceOnHand ) {
      this.props.onMovePiece(position, this.state.pieceOnHand);
      this.setState({ pieceOnHand: null });
    } else {
      if ( grabbedPiece ) {
        if ( grabbedPiece.color === this.props.turn ) {
          this.setState({ pieceOnHand: position });
        }
      } else if (position !== this.state.pieceOnHand) {
        this.props.onMovePiece( position );
      } else {
        this.setState({ pieceOnHand: null });
      }
    }
  }

  renderSpot(spot) {
    return <Spot
             key={spot.position}
             {...spot}
             selected={spot.position === this.state.pieceOnHand}
             onClick={ this.onPieceClicked.bind(this) }
           />;
  }

  render() {
    const classes = [
      "board",
      "board--" + this.props.sides + "x" + this.props.sides,
    ];

    return (
      <div className={ classes.join(" ") }>
        {
          this.props.board.map((spot) => this.renderSpot(spot) )
        }
      </div>
    );
  }
}

export default BoardContainer;
