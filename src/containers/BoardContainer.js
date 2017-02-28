import React, { Component } from 'react';
import Spot from "../containers/SpotContainer";


class BoardContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pieceOnHand: null,
    };
  }

  isDestinationAllowed(destination) {
    const delta = destination - this.state.pieceOnHand;

    if ( delta === 1 && destination % this.props.sides > 0 ) {
      return true;
    } else if ( delta === -1 && destination > 0 && destination % this.props.sides > 0) {
      return true;
    } else if ( delta === this.props.sides && destination < this.props.sides * this.props.sides ) {
      return true;
    } else if ( delta === -this.props.sides && destination > 0) {
      return true;
    }
    
    return false;
  }

  onPieceClicked(position, grabbedPiece) {
    if ( this.state.pieceOnHand ) {
      if (position !== this.state.pieceOnHand && this.isDestinationAllowed(position)) {
        this.props.onMovePiece(position, this.state.pieceOnHand);
      }
      this.setState({ pieceOnHand: null });
    } else {
      if ( grabbedPiece ) {
        if ( grabbedPiece.color === this.props.turn ) {
          this.setState({ pieceOnHand: position });
        }
      } else {
        this.props.onMovePiece( position );
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

BoardContainer.propTypes = {
  board: React.PropTypes.array.isRequired,
  sides: React.PropTypes.number.isRequired,
  turn: React.PropTypes.string.isRequired,
  onMovePiece: React.PropTypes.func.isRequired,
};

export default BoardContainer;
