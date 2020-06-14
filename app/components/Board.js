import React from 'react';
import { Square } from './Square';


export class Board extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			dim: 3, // dimensions du Board
			grid: Array(3).fill(0).map(x=>Array(3).fill(0)), // Création d'un 2D Array remplit de 0
			saved: [], // historique des positions (x, y) des coups joués
		};
		// J'adapte ici les dimensions qui serviront pour chaque case en fonction des dimensions du Board
		this.dims = [parseFloat(500/this.state.grid.length), parseFloat(500/this.state.grid[0].length)]
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleOnClick = this.handleOnClick.bind(this);
		this.handleRollback = this.handleRollback.bind(this);
		this.checkEndGame = this.checkEndGame.bind(this);
  	}

	// Chaque input de l'utilisateur met à jour la valeur de this.state.dim
  	handleChange(event){
		this.setState({ dim: Number(event.target.value) });
	};

	// La fonction génère un nouvel Array à 2 dimensions selon this.state.dim
	handleSubmit(){
		this.setState({'grid': Array(this.state.dim).fill(0).map(x=>Array(this.state.dim).fill(0))});
	}

	// Appelée à chaque fois que l'utilisateur va cliquer un élément <Square/>, la fonction parcourt
	// toutes les cases du Board pour placer la reine aux coordonnées souhaitées et incrémente de 1 toutes
	// les cases à l'horizontale ainsi qu'à la verticale et dans les diagonales.
	handleOnClick(x, y){
		const g = this.state.grid
		if (g[x][y] == ' '){
			for(var i = 0; i < this.state.dim; i++) {
				for(var j = 0; j < this.state.dim; j++) {
					if (i == x || j == y){
						g[i][j] += 1;
					};
					if (Math.abs(i - x) == Math.abs(j - y)){
						g[i][j] += 1;
					};
				}
			}
			g[x][y] = '♕';
			this.setState({ 'grid': g });

   			var obj = {
        		'x': x,
        		'y': y,
    		}
    		this.setState({ 'saved': this.state.saved.concat(obj) });


			this.checkEndGame();
		}
		else{
			alert('Not possible!');
		}
	}

	// CheckEndGame parcourt toutes les cases du Board et met 'possibilities' à true si elle 
	// trouve la moindre case égale à 0. Si 'possibilities' reste à false, un message de fin est envoyé.
	checkEndGame(){
		var possibilities = false;
		const g = this.state.grid
		for(var i = 0; i < this.state.dim; i++) {
			for(var j = 0; j < this.state.dim; j++) {
				if (g[i][j] == 0){
					possibilities = true;
					return;	
				}
			}
		}
		// Timeout pour que le message apparaisse intuitivement après le remplissage du Board
		if (possibilities == false){
			setTimeout(()=>{alert('End of Game!')}, 10);
		}
	};

	// Fonction qui cherche la position du dernier coup joué, supprime la reine en question et 
	// décrémente de 1 toutes les cases à l'horizontale ainsi qu'à la verticale et dans les diagonales.
	handleRollback(){
		const g = this.state.grid
		const last_move = this.state.saved.length - 1
		const x = this.state.saved[last_move]['x']
		const y = this.state.saved[last_move]['y']

		for(var i = 0; i < this.state.dim; i++) {
			for(var j = 0; j < this.state.dim; j++) {
				if (i == x || j == y){
					g[i][j] -= 1;
				};
				if (Math.abs(i - x) == Math.abs(j - y)){
					g[i][j] -= 1;
				};
			}
		}
		g[x][y] = 0;
		this.setState({ 'grid': g });
		// Suppression du dernier élément du tableau 'saved' qui correspond au dernier coup joué
		var array = [...this.state.saved];
    	array.splice(last_move, 1);
    	this.setState({'saved': array});
	};

	render(){
		const style = {
			margin: 'auto',
			width: 'auto',
			height: 'auto',
			fontSize: '3em',
			tableLayout:'fixed',
		}
		// Toutes les cases du Board vont être générés ici en mapant l'Array à 2 dimensions
		const rows = this.state.grid.map((r, i) => {return (
			<tr key={'row_'+i}>
			{r.map((d, j) => {return(
				<Square
					key={i+'_'+j}
					dims={this.dims}
					onClick={()=>{this.handleOnClick(i,j)}}
					contents={d == '♕' ? d : ' '}
					blocked={typeof(d) == 'number' && d > 0 ? true : false}
				/>
			)})}
			</tr>
		)});
		
		return (
			<div style={{textAlign:'center'}}>
				<h1 >BNP Tech Test</h1>
				<small>Queen Movement Visualisator, written with <b>ReactJS</b>.</small>
				<br />
				<br />
				<span>N = </span>
				<input
					type='number'
					value={this.state.dim}
					onChange={this.handleChange}
				/>
				<button style={{margin:'auto'}} onClick={this.handleSubmit}>Ok</button>
				<br />
				<br />
				<button style={{margin:'auto'}} onClick={this.handleRollback}>Return</button>
				<br />
				<br />
				<table cellSpacing='0' id='table' style={style}>
					<tbody>
						{rows}
					</tbody>
				</table>				
			</div>
		)
	}
}
