import React, { Component } from 'react';
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

        const classes = [
          "piece",
          "piece--" + piece.color,
          "piece--" + piece.pieceType,
        ];

        if ( this.props.selected ) {
          classes.push( "selected" );
        }

        return <div className={ classes.join(" ") }
                    key={index}
                    style={styles}
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
