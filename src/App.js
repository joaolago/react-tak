import React, { Component } from 'react';
import Game from "./containers/GameContainer";
import Intro from "./components/Intro";

import './styles/App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gridSize: null,
    };
  }

  onSizeSelected(size) {
    this.setState({ gridSize: size });
  }

  render() {
    switch ( this.state.gridSize ) {
      case null:
        return <Intro onSizeSelected={this.onSizeSelected.bind(this)} />;
      default:
        return <Game gridSize={this.state.gridSize}
                     onSizeSelected={this.onSizeSelected.bind(this)}
               />;
    }
    
  }
}

export default App;
