import React, { Component } from 'react';
import Board from "./containers/BoardContainer";
import './styles/App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sides: 3,
      turn: "white",
      board: []
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
      const spot = { position: i, content: [] };
      
      newBoard.push(spot);
    }

    this.setState({ board: newBoard });
  }

  handleMovePiece( newPosition, oldPosition ) {
    const newBoard = this.state.board;
    const destinationPosition = this.state.board.find(
      (square) => square.position === newPosition
    );
    
    let originPosition = null;

    if ( oldPosition ) {
       originPosition = this.state.board.find(
        (square) => square.position === oldPosition
      );
      originPosition.content.pop();
      newBoard[oldPosition] = originPosition;
    }

    destinationPosition.content.push({ color: this.state.turn });
    newBoard[newPosition] = destinationPosition;
    
    const nextTurn = this.state.turn === "white" ? "brown" : "white";

    this.setState({
      board: newBoard,
      turn: nextTurn
    });
  }

  render() {
    return (
      <div className="App">
        <h1>Player's turn: { this.state.turn }</h1>
        <Board board={this.state.board}
               sides={this.state.sides}
               turn={this.state.turn}
               onMovePiece={this.handleMovePiece.bind(this)}
        />
      </div>
    );
  }
}

export default App;
