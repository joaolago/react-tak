import React, { Component } from 'react';
import Board from "./BoardContainer";
import PieceSelector from "../components/PieceSelector";


class GameContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sides: props.gridSize,
      turn: "white",
      turnCount: 0,
      pieceType: "normal",
      playedCaps: {
        white: false,
        brown: false
      },
      board: [],
    };
  }

  componentDidMount() {
    this.buildBoard();
  }

  buildBoard() {
    const newBoard = [];
    const { sides } = this.state;

    // TODO: Refactor this
    for (let i = 0; i < sides * sides; i++) {
      const spot = {
        position: i,
        content: [],
      };
      
      newBoard.push(spot);
    }

    this.setState({ board: newBoard });
  }

  handleMovePiece( newPosition, oldPosition ) {
    const { board, playedCaps } = this.state;
    const destinationPosition = this.state.board.find(
      (square) => square.position === newPosition
    );
    let pieceColor = this.state.turn;

    if ( this.state.turnCount < 2 ) {
      pieceColor =  this.state.turn === "white" ? "brown" : "white";
    }
    
    let originPosition = null;

    if ( oldPosition ) {
       originPosition = this.state.board.find(
        (square) => square.position === oldPosition
      );
      originPosition.content.pop();
      board[oldPosition] = originPosition;
    }

    destinationPosition.content.push({
      color: pieceColor,
      pieceType: this.state.pieceType,
    });


    if ( this.state.pieceType === "cap" ) {
      playedCaps[this.state.turn] = true;
    }

    board[newPosition] = destinationPosition;
    
    const nextTurn = this.state.turn === "white" ? "brown" : "white";

    this.setState({
      board,
      turn: nextTurn,
      turnCount: this.state.turnCount+1,
      playedCaps,
      pieceType: "normal",
    });
  }

  onPieceTypeChanged(type) {
    this.setState({ pieceType: type });
  }

  render() {
    return (
      <div className="App">
        <h1>Player's turn: { this.state.turn }</h1>
        <Board board={this.state.board}
               sides={this.state.sides}
               turn={this.state.turn}
               currentPieceType={this.state.pieceType}
               onMovePiece={this.handleMovePiece.bind(this)}
        />
        <PieceSelector currentTurn={this.state.turn}
                       onPieceSelected={this.onPieceTypeChanged.bind(this)}
                       selected={this.state.pieceType}
                       caps={this.state.playedCaps}
        />

        <p>
          <a onClick={this.props.onSizeSelected.bind(this, null)} >
            Return to Menu
          </a>
        </p>
      </div>
    );
  }
}

export default GameContainer;
