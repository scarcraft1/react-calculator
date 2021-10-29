import React from 'react';
import ReactDOM from 'react-dom';
import parse from 'html-react-parser';
import './index.css';

const evaluate = (operation) => Function(`'use strict'; return (${operation});`)();

const nextState = (key, state) => {
	if (!isNaN(state.number + key)) {
		if (state.isTotal) {
			return {
				...state,
				isTotal: false,
				number: key === '.' ? '0.' : key
			};
		}
		return {
			...state,
			number: state.number === '0' && !isNaN(key)
				? key
				: state.number + key
		};
	} else {
		switch (key) {
			case 'Backspace':
				return {
					...state,
					isTotal: false,
					number: state.number.length > 1
						? state.number.slice(0, -1)
						: '0'
				};
			case 'Delete':
				return {
					...state,
					isTotal: false,
					number: '0'
				};
			case '*':
			case '/':
			case '+':
			case '-':
				const operatorSymbol = key === '*' ? '✖️'
					: key === '/' ? '➗'
					: key === '+' ? '➕'
					: '➖';
				if (state.isTotal && state.operation.length > 0) {
					return {
						...state,
						operation: state.operation.slice(0, -1) + key
					};
				}
				if (state.operation.length) {
					state.history[state.history.length - 1] += state.number + '</div>';
				}
				else {
					state.history.push('<div><div>' + state.number + '</div>');
				}
				state.history.push('<div>' + operatorSymbol + '&nbsp;');
				return {
					isTotal: true,
					number: evaluate(state.operation + state.number),
					operation: state.operation + state.number + key,
					history: state.history
				};
			case '=':
				if (!state.operation) {
					return {
						...state,
						number: '0'
					};
				}
				state.history[state.history.length -1] += state.number + '</div>';
				if (state.isTotal) {
					const number = evaluate(state.operation.slice(0, -1));
					state.history.push('<hr />');
					state.history.push('<div>=&nbsp;' + number + '</div></div>'); 
					return {
						isTotal: true,
						number,
						operation: '',
						history: state.history
					};
				}
				const number = evaluate(state.operation + state.number);
				state.history.push('<hr />');
				state.history.push('<div>=&nbsp;' + number + '</div></div>'); 
				return {
					isTotal: true,
					number,
					operation: '',
					history: state.history
				}
			default:
				break;
		}
	}
};

class Calculator extends React.Component {
	constructor(props)  {
		super(props);
		this.processKey = this.processKey.bind(this);
		this.pressKey = this.pressKey.bind(this);
		this.state = {
			number: '0',
			isTotal: false,
			operation: '',
			history: []
		};
	}

	pressKey(key) {
		this.setState(state => nextState(key, state));
	}

	processKey($event) {
		const key = $event.key === 'Enter' ? '=' : $event.key;
		this.pressKey(key);
	}

	render() {
		return (
			<div>
				<h3>Calculadora</h3>
				<div id="calculator">
					<input id="display" onKeyDown={this.processKey} value={this.state.number} readOnly/>
					<div className="buttons">
						<button type="button" onClick={() => this.pressKey('7')}>7</button>
						<button type="button" onClick={() => this.pressKey('8')}>8</button>
						<button type="button" onClick={() => this.pressKey('9')}>9</button>
						<button type="button" onClick={() => this.pressKey('/')}>➗</button>
						<button type="button" onClick={() => this.pressKey('4')}>4</button>
						<button type="button" onClick={() => this.pressKey('5')}>5</button>
						<button type="button" onClick={() => this.pressKey('6')}>6</button>
						<button type="button" onClick={() => this.pressKey('*')}>✖️</button>
						<button type="button" onClick={() => this.pressKey('1')}>1</button>
						<button type="button" onClick={() => this.pressKey('2')}>2</button>
						<button type="button" onClick={() => this.pressKey('3')}>3</button>
						<button type="button" onClick={() => this.pressKey('-')}>➖</button>
						<button type="button" onClick={() => this.pressKey('.')}>.</button>
						<button type="button" onClick={() => this.pressKey('0')}>0</button>
						<button type="button" onClick={() => this.pressKey('Delete')}>🗑️</button>
						<button type="button" onClick={() => this.pressKey('+')}>➕</button>
						<button type="button" onClick={() => this.pressKey('=')}>=</button>
		      </div>
				</div>
				<h3>Historial</h3>
				<div id="history">
					{parse(this.state.history.join(''))}
				</div>
			</div>
		);
	};
}

ReactDOM.render(
	<Calculator />,
	document.getElementById('root')
);
