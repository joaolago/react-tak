import React, { Component } from 'react';
import Piece from '../components/Piece';
import "../styles/Spot.css";

class SpotContainer extends Component {

  handleClick() {
    const topPiece = this.props.content.length > 0 ?
                       this.props.content[this.props.content.length-1]
                       :
                       null;

    this.props.onClick(this.props, topPiece);
  }

  render() {
    let spotContent = null;

    if ( this.props.content.length === 0 ) {
      spotContent = <div className="spot__empty"></div>;
    } else {
      spotContent = this.props.content.map((piece, index) => {
        const styles = {
          zIndex: index,
          bottom: 30 + (index * 10),
          left: 23 + (index ),
        };

        if ( piece.pieceType === "wall" ) {
          styles.bottom += 5;
        }

        return <Piece color={ piece.color }
                      pieceType={ piece.pieceType }
                      selected={ this.props.selected }
                      key={ index }
                      styles={ styles }
               />;
      });
    }

    return (
      <div className="spot"
           onClick={ this.handleClick.bind(this) }
      >
        {
          spotContent
        }
      </div>
    );
  }
}

SpotContainer.propTypes = {
  selected: React.PropTypes.bool,
  onClick: React.PropTypes.func.isRequired,
};

export default SpotContainer;
