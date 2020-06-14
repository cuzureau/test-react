import React from 'react';

// Chaque élément Square réprésente un case du Board. La couleur du fond sera définie en fonction de la valeur
// de contents et de blocked passé en paramètres.
export class Square extends React.Component {
	render(){
		const color = this.props.contents == '♕' ? 'grey':'white';
		const style = {
			backgroundColor: this.props.blocked ? 'red' : color,
			width: this.props.dims[0],
			height: this.props.dims[1],
			border:'2px solid black',
			tableLayout:'fixed',
		}

		return (
			<td
				style={style}
				onClick={this.props.onClick}
			>
				{this.props.contents}
			</td>
		)
	}
}