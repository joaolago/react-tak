import React, { Component } from 'react';
import Board from "./containers/BoardContainer";
import './styles/App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sides: 3,
      turn: "white",
      pieceType: "normal",
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
      const spot = {
        position: i,
        content: [],
      };
      
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

    destinationPosition.content.push({
      color: this.state.turn,
      pieceType: this.state.pieceType,
    });

    newBoard[newPosition] = destinationPosition;
    
    const nextTurn = this.state.turn === "white" ? "brown" : "white";

    this.setState({
      board: newBoard,
      turn: nextTurn,
      pieceType: "normal",
    });
  }

  onPieceTypeChanged(event) {
    this.setState({ pieceType: event.target.value });
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
        <p>
          <label htmlFor="pieceType"> Select Piece Type: </label>
            <select name="pieceType" onChange={ this.onPieceTypeChanged.bind(this) }
                    value={ this.state.pieceType }
            >
              <option value="normal">Normal</option>
              <option value="wall">Wall</option>
              <option value="cap">Cap</option>
            </select>
        </p>
      </div>
    );
  }
}

export default App;
