// A maze is a set of edges connecting cells in a square grid. 
// The edges form a spanning tree.
// The algorithm used to generate the maze will create a random spanning tree.

class Stack {
	constructor() {
		this.items = []
		this.length = 0
	}
	push(item) {
		this.length++;
		if (this.items.length < this.length) {
			this.items.push(item)
		}
		else {
			this.items[this.length - 1] = item
		}
	}
	pop() {
		let last = this.items[this.length - 1];
		this.length--;
		return last;
	}
	remove(index) {
		this.items[index] = this.items[this.length - 1]
		this.length--
	}
	removeRandom() {
		let index = Math.floor(Math.random() * this.length)
		let item = this.items[index]
		this.remove(index)
		return item
	}
	print() {
		console.log(this.items.slice(0, this.length))
	}
}

class Maze {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.setEdges(); //Sets all edges to be walled off
		this.generateMaze();
	}

	setEdges() {
		// Each edge corresponds to left, up, right, down connections. 
		// False means that you cannot go in that direction.
		this.edges = [];
	}
	//Gets nodes (ints) adjacent to given node (int)
	adjacentNodes(node) {
		let result = []
		let x = node % this.width;
		let y = Math.floor(node / this.width)
		let vectors = [[0, -1], [-1, 0], [1, 0], [0, 1]]
		for (var vector of vectors) {
			let adjX = x + vector[0]
			let adjY = y + vector[1]
			if (adjX >= 0 && adjX < this.width && adjY >= 0 && adjY < this.height) {
				result.push(adjY * this.width + adjX)
			}
		}
		return result;
	}
	// explores the given node (integer index) and sets the proper value in this.edges
	// also adds the new possible edges to possibleEdges and adds the new node to "explored"
	exploreNode(node, possibleEdges, explored) {
		// update explored to include this node
		explored[node] = true
		let children = this.adjacentNodes(node)
		//If the child has not been explored yet, add it to the possible edges
		for (var child of children) {
			if (!(explored[child])) {
				possibleEdges.push(new Edge(node, child))
			}
		}
	}

	addEdge(edge) {
		this.edges.push(edge)
	}

	generateMaze() {
		//possibleEdges is a list of edges which can be made passable
		let possibleEdges = new Stack();

		// Explored is a list of nodes which have already been explored.
		let explored = [];
		// Initially none of the nodes are explored
		for (var i = 0; i < this.width * this.height; i++) {
			explored[i] = false
		}
		//Pick a random node to explore first
		let randomNode = Math.floor(Math.random() * this.width * this.height)
		this.exploreNode(randomNode, possibleEdges, explored);
		//Keep track of the number of nodes explored
		let numExplored = 1
		while( numExplored < this.width * this.height) {
			// pick a random edge from possibleEdges
			let edge = possibleEdges.removeRandom();
			if (explored[edge.child]) {				
				continue
			}
			// make this edge passable
			this.addEdge(edge);
			this.exploreNode(edge.child, possibleEdges, explored)
			numExplored++
		}
	}

	drawMaze(cellSize, wallWidth) {
		const canvas = document.getElementById('canvas');
		canvas.width = (this.width + 1) * cellSize
		canvas.height = (this.height + 1 ) * cellSize
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "black"
		for (var col = 0; col <= this.width; col++) {
			let x = col * cellSize
			ctx.fillRect(x, 0, wallWidth, this.height * cellSize)
		}
		for (var row = 0; row <= this.height; row++) {
			let y = row * cellSize
			ctx.fillRect(0, y, this.width * cellSize, wallWidth)
		}
		ctx.fillStyle = 'white'
		for (var edge of this.edges) {
			let {parent, child} = edge
			if (parent > child) {
				[parent, child] = [child, parent]
			}
			let x = parent % this.width * cellSize
			let y = Math.floor(parent / this.width) * cellSize
			console.log(parent, child)
			if (child - parent == 1) {
				ctx.fillRect(x + cellSize, y + wallWidth, wallWidth, cellSize - wallWidth)
			}
			else {
				ctx.fillRect(x + wallWidth, y + cellSize, cellSize - wallWidth, wallWidth)
			}
		}

	}
}

class Edge {
	constructor(parent, child) {
		this.parent = parent;
		this.child = child;
	}
}

let maze = new Maze(1000, 1000)
maze.drawMaze(5, 1)