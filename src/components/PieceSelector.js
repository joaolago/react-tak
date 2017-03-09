import React, { Component } from 'react';
import Piece from './Piece';
import '../styles/PieceSelector.css';

class PieceSelector extends Component {
  constructor(props) {
    super(props);

    this.state = { selected: "" };
  }

  pieceSelected(selection) {
    this.setState({ selected: selection });
    this.props.onPieceSelected.bind(this, selection);
  }

  render() {
    return (
      <div className="piece-selector">
        <a className={ this.state.selected === "normal" ? "selected" : ""}
           onClick={this.pieceSelected.bind(this, "normal")}
        >
          <Piece color={this.props.currentTurn}
                 demo={true}
                 pieceType="normal"
          />
        </a>
        
        <a className={ this.state.selected === "wall" ? "selected" : ""}
           onClick={this.pieceSelected.bind(this, "wall")}
        >
          <Piece color={this.props.currentTurn}
                 demo={true}
                 pieceType="wall"
          />
        </a>

        <a className={ this.state.selected === "cap" ? "selected" : ""}
           onClick={this.pieceSelected.bind(this, "cap")}
        >
          <Piece color={this.props.currentTurn}
                 demo={true}
                 pieceType="cap"
          />
        </a>
      </div>
    );
  }
}

PieceSelector.propTypes = {
  currentTurn: React.PropTypes.string.isRequired,
};

export default PieceSelector;
