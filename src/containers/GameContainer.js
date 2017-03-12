import React, { Component } from 'react';
import _ from 'underscore';
import Board from "./BoardContainer";
import PieceSelector from "../components/PieceSelector";


class GameContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      turn: "white",
      turnCount: 0,
      pieceType: "normal",
      playedCaps: {
        white: false,
        brown: false
      },
      board: [],
      endGame: false,
    };
  }

  componentDidMount() {
    this.buildBoard();
  }

  buildBoard() {
    const newBoard = [];
    const sides = this.props.gridSize;

    // TODO: Refactor this
    for (let i = 0; i < sides * sides; i++) {
      const spot = {
        position: i,
        content: [],
      };
      
      newBoard.push(spot);
    }

    this.setState({
      board: newBoard,
      turn: "white",
      turnCount: 0,
      pieceType: "normal",
      playedCaps: {
        white: false,
        brown: false
      },
      endGame: false,
    });
  }

  handleMovePiece( newPosition, oldPosition ) {
    const { board, playedCaps } = this.state;
    const destinationPosition = this.state.board.find(
      (square) => square.position === newPosition
    );
    let pieceColor = this.state.turn;

    if ( this.state.turnCount < 2 ) {
      pieceColor = this.state.turn === "white" ? "brown" : "white";
    }
    
    let originPosition = null;

    if ( oldPosition !== undefined ) {
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
  
  checkSpotColor(spot, color) {
    return spot && spot.content && spot.content.length > 0 && _.last(spot.content).color === color;
  }

  componentDidUpdate() {
    !this.state.endGame && this.evaluateBoard();
  }

  onPieceTypeChanged(type) {
    this.setState({ pieceType: type });
  }

  evaluateBoard() {
    const sides = this.props.gridSize;
    const n2sMatrix = [];
    const e2wMatrix = [];

    for ( let i = 0; i < sides; i++ ) {
      n2sMatrix.push(this.state.board.slice(i * sides, (i + 1) * sides));
    }

    for ( let i = 0; i < sides; i++ ) {
      const tmpArray = [];
      
      for ( let j = 0; j < sides; j++ ) {
        tmpArray.push(n2sMatrix[j][i]);
      }

      e2wMatrix.push(tmpArray);
    }

    if ( this.calculatePaths( n2sMatrix, "white") ||
         this.calculatePaths( e2wMatrix, "white")
    ) {
      this.setState({ endGame: true, victor: "white" })
    } else if ( this.calculatePaths( n2sMatrix, "brown") ||
                this.calculatePaths( e2wMatrix, "brown")
    ) {
      this.setState({ endGame: true, victor: "brown" })
    }

  }

  calculatePaths( matrix, color ) {
    const firstRow = _.first(matrix);
    const view = this;

    if ( _.some(firstRow, (spot) => view.checkSpotColor(spot, color)) ) {
      for (let i = 0; i < firstRow.length; i++) {
        if ( view.checkSpotColor(matrix[0][i], color) ) {
          return view.findShortestPath([0, i], matrix, color);
        }
      }
    } else {
      return false;
    }
  }

  findShortestPath( startCoordinates, grid, color ) {
    const distanceFromTop = startCoordinates[0];
    const distanceFromLeft = startCoordinates[1];
    const view = this;
    // Each "location" will store its coordinates
    // and the shortest path required to arrive there
    const location = {
      distanceFromTop,
      distanceFromLeft,
      path: [],
      status: 'Start'
    };

    // Initialize the queue with the start location already inside
    const queue = [location];

    // Loop through the grid searching for the goal
    while (queue.length > 0) {
      // Take the first location off the queue
      const currentLocation = queue.shift();
      let newLocation = null;
      // Explore East
      newLocation = view.exploreInDirection(currentLocation, 'East', grid, color);
      if (newLocation.status === 'Goal') {
        return true;
      } else if (newLocation.status === 'Valid') {
        queue.push(newLocation);
      }

      // Explore South
      newLocation = view.exploreInDirection(currentLocation, 'South', grid, color);
      if (newLocation.status === 'Goal') {
        return true;
      } else if (newLocation.status === 'Valid') {
        queue.push(newLocation);
      }

      // Explore West
      newLocation = view.exploreInDirection(currentLocation, 'West', grid, color);
      if (newLocation.status === 'Goal') {
        return true;
      } else if (newLocation.status === 'Valid') {
        queue.push(newLocation);
      }
    }

    return false;
  }

  exploreInDirection(currentLocation, direction, grid, color) {
    const newPath = currentLocation.path.slice();
    newPath.push(direction);

    let dft = currentLocation.distanceFromTop;
    let dfl = currentLocation.distanceFromLeft;

    if (direction === 'North') {
      dft -= 1;
    } else if (direction === 'East') {
      dfl += 1;
    } else if (direction === 'South') {
      dft += 1;
    } else if (direction === 'West') {
      dfl -= 1;
    }

    const newLocation = {
      distanceFromTop: dft,
      distanceFromLeft: dfl,
      path: newPath,
      status: 'Unknown'
    };

    newLocation.status = this.locationStatus(newLocation, grid, color);

    // If this new location is valid, mark it as 'Visited'
    if (newLocation.status === 'Valid') {
      grid[newLocation.distanceFromTop][newLocation.distanceFromLeft] = 'Visited';
    }

    return newLocation;
  }

  locationStatus(location, grid, color) {
    const gridSize = grid.length;
    const dft = location.distanceFromTop;
    const dfl = location.distanceFromLeft;

    if (location.distanceFromLeft < 0 ||
        location.distanceFromLeft >= gridSize ||
        location.distanceFromTop < 0 ||
        location.distanceFromTop >= gridSize) {

      // location is not on the grid--return false
      return 'Invalid';
    } else {
      if ( this.checkSpotColor(grid[dft][dfl], color) ) {
        if ( dft === this.props.gridSize - 1) {
          return 'Goal';
        } else {
          return 'Valid';
        }
      } else if (grid[dft][dfl].color !== color) {
        // location is either an obstacle or has been visited
        return 'Blocked';
      } else {
        return 'Valid';
      }
    }
  }
  
  render() {
    let underTheBoard = null;
    if ( this.state.endGame ) {
      underTheBoard = <p>The winner is {this.state.victor}!</p>
    } else if ( this.state.turnCount < 2 ) {
      underTheBoard = <p>Place the other player's first piece.</p>
    } else {
      underTheBoard = <PieceSelector currentTurn={this.state.turn}
                     onPieceSelected={this.onPieceTypeChanged.bind(this)}
                     selected={this.state.pieceType}
                     caps={this.state.playedCaps}
      />
    }

    return (
      <div className="App">
        <h1>Player's turn: { this.state.turn }</h1>
        <Board board={this.state.board}
               sides={this.props.gridSize}
               turn={this.state.turn}
               currentPieceType={this.state.pieceType}
               onMovePiece={this.handleMovePiece.bind(this)}
        />

        { underTheBoard }

        <p>
          <a onClick={this.props.onSizeSelected.bind(this, null)} >
            Return to Menu
          </a>
        </p>
        <p>
          <a onClick={this.buildBoard.bind(this, null)} >
            Reset
          </a>
        </p>
      </div>
    );
  }
}

export default GameContainer;
