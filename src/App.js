import React, { Component } from 'react';
import Board from "./containers/BoardContainer";
import PieceSelector from "./components/PieceSelector";

import './styles/App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sides: 5,
      turn: "white",
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
    
    let originPosition = null;

    if ( oldPosition ) {
       originPosition = this.state.board.find(
        (square) => square.position === oldPosition
      );
      originPosition.content.pop();
      board[oldPosition] = originPosition;
    }

    destinationPosition.content.push({
      color: this.state.turn,
      pieceType: this.state.pieceType,
    });


    if ( this.state.pieceType === "cap" ) {
      playedCaps[this.state.turn] = true;
    }

    board[newPosition] = destinationPosition;
    
    const nextTurn = this.state.turn === "white" ? "brown" : "white";

    this.setState({
      board: board,
      turn: nextTurn,
      playedCaps: playedCaps,
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
      </div>
    );
  }
}

export default App;
