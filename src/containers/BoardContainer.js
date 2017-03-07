import React, { Component } from 'react';
import Spot from "../containers/SpotContainer";


class BoardContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pieceOnHand: null,
      originalStackLength: null,
    };
  }

  isDestinationAllowed(destination) {
    const delta = destination - this.state.pieceOnHand;

    if ( delta === 1 && destination % this.props.sides > 0 ) {
      return true;
    } else if ( delta === -1 && destination > 0 && destination % this.props.sides >= 0) {
      return true;
    } else if ( delta === this.props.sides && destination < this.props.sides * this.props.sides ) {
      return true;
    } else if ( delta === -this.props.sides && destination > 0) {
      return true;
    }

    return false;
  }

  onPieceClicked(props, grabbedPiece) {
    const { position, content } = { ...props };

    if ( this.state.pieceOnHand ) { // We're about to move a piece to another spot or on top of another piece
      if (
        position !== this.state.pieceOnHand && // We're not moving to the same location
        this.isDestinationAllowed(position) && // We're not making an illegal move
        this.state.originalStackLength >= content.length // The  destination stack is legal
      ) {
        this.props.onMovePiece(position, this.state.pieceOnHand);
      }
      this.setState({
        pieceOnHand: null,
        originalStackLength: null
      });
    } else { // We don't have a piece in our hand
      if ( grabbedPiece ) { // We're grabbing a piece
        if ( grabbedPiece.color === this.props.turn ) { // Is this our piece?
          this.setState({
            pieceOnHand: position,
            originalStackLength: content.length
          });
        }
      } else { // We're dropping a new piece
        this.props.onMovePiece( position );
      }
    }
  }

  render() {
    const view = this;
    const classes = [
      "board",
      "board--" + this.props.sides + "x" + this.props.sides,
    ];
    
    return (
      <div className={ classes.join(" ") }>
        {
          this.props.board.map((spot) =>
            <Spot
              key={spot.position}
              {...spot}
              selected={spot.position === view.state.pieceOnHand}
              onClick={ view.onPieceClicked.bind(view) }
            />
          )
        }
      </div>
    );
  }
}

BoardContainer.propTypes = {
  board: React.PropTypes.array.isRequired,
  sides: React.PropTypes.number.isRequired,
  turn: React.PropTypes.string.isRequired,
  onMovePiece: React.PropTypes.func.isRequired,
};

export default BoardContainer;
