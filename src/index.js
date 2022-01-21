import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
      <button
        className="square"
        onClick={props.onClick}
      >
        {props.value}
      </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

function declareWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let lineIndex=0;lineIndex<lines.length;lineIndex++) {
    let player = squares[lines[lineIndex][0]];
    let winner = true;
    for (let index=1;index<lines[lineIndex].length;index++) {
      if (
        player != squares[lines[lineIndex][index]] ||
        player == null
      ) {
        winner = false;
      }
    }
    if (winner) {
      return player;
    }
  }
  return '';
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0,
    });
  }

  jumpTo(stepNumber) {
    this.setState({
      stepNumber: stepNumber,
      xIsNext: stepNumber % 2 == 0,
    });
  }

  handleClick(i) {

    const history = this.state.history;
    const currentBoard = this.state.history[this.state.stepNumber];
    const squares = currentBoard.squares.slice();

    if (
      squares[i] === null &&
      declareWinner(squares) === ''
    ) {
      squares[i] = (this.state.xIsNext === true ? 'X': 'O');
      this.setState({
        history: history.concat([{
          squares: squares
        }]),
        xIsNext: !this.state.xIsNext,
        stepNumber: history.length
      });
    }
  }

  render() {
    const history = this.state.history;
    const currentBoard = this.state.history[this.state.stepNumber];

    const moves = history.map((element, index) => {
      const desc = index ? 'Go to move #' + index : 'Go to game start';
      return (
        <li key={index}>
          <button
            onClick={() => this.jumpTo(index)}
          >
            {desc}
          </button>
        </li>
      )
    })

    let status;
    if (declareWinner(currentBoard.squares) === '') {
      status = 'Next player is: ' + (this.state.xIsNext ? 'X': 'O');
    } else {
      status = declareWinner(currentBoard.squares) + " is the winner HOORAY!";
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={currentBoard.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
