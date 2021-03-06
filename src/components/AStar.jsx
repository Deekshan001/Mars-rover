function initialize(grid) {
  var x = 0;
  var y = 0;
  for (x = 0; x < grid.length; x++) {
    for (y = 0; y < grid[x].length; y++) {
      grid[x][y].f = 0;
      grid[x][y].g = 0;
      grid[x][y].h = 0;
      grid[x][y].isVisited = false;
      grid[x][y].closed = false;
      grid[x][y].row = x;
      grid[x][y].col = y;
    }
  }
}

//check if node is safe
function isSafe(x, y, cells) {
  if (x >= 0 && y >= 0 && x < 22 && y < 59 && cells[x][y].isWall === false)
    return true;
  else return false;
}

//returns a list of safe neighbours
function getNeighbours(grid, node) {
  var ret = [];
  var x = node.row;
  var y = node.col;
  if (isSafe(x - 1, y, grid)) {
    ret.push(grid[x - 1][y]);
  }
  if (isSafe(x + 1, y, grid)) {
    ret.push(grid[x + 1][y]);
  }
  if (isSafe(x, y - 1, grid)) {
    ret.push(grid[x][y - 1]);
  }
  if (isSafe(x, y + 1, grid)) {
    ret.push(grid[x][y + 1]);
  }
  return ret;
}

function getNeighboursDiagnol(grid, node) {
  var ret = [];
  var x = node.row;
  var y = node.col;
  if (isSafe(x - 1, y, grid)) {
    ret.push(grid[x - 1][y]);
  }
  if (isSafe(x + 1, y, grid)) {
    ret.push(grid[x + 1][y]);
  }
  if (isSafe(x, y - 1, grid)) {
    ret.push(grid[x][y - 1]);
  }
  if (isSafe(x, y + 1, grid)) {
    ret.push(grid[x][y + 1]);
  }
  if (isSafe(x + 1, y + 1, grid)) {
    ret.push(grid[x + 1][y + 1]);
  }
  if (isSafe(x + 1, y - 1, grid)) {
    ret.push(grid[x + 1][y - 1]);
  }
  if (isSafe(x - 1, y + 1, grid)) {
    ret.push(grid[x - 1][y + 1]);
  }
  if (isSafe(x - 1, y - 1, grid)) {
    ret.push(grid[x - 1][y - 1]);
  }
  return ret;
}

//function to calculate heuristic value
function heuristicManhattan(node1, node2) {
  var d1 = Math.abs(node1.row - node2.row); //Manhatten distance
  var d2 = Math.abs(node1.col - node2.col);
  return d1 + d2;
}
//function to calculate heuristic value
function heuristicDiagnol(node1, node2) {
  return Math.max(Math.abs(node1.row – node2.row),
           Math.abs(node1.col – node.col)) ;
}
//function to calculate heuristic value
function heuristicEuclidean(node1, node2) {
  return Math.sqrt(Math.pow((node1.row – node2.row),2)+Math.pow((node1.col – node2.col),2)) ;
}

function remove(list, item) {
  var x = list.indexOf(item);
  list.splice(x, 1); //removes item at index x
}

function crawlBack(cur) {
  var crawlBack = [];
  crawlBack.push(cur);
  while (cur !== null) {
    cur = cur.parent;
    if (cur !== null) crawlBack.push(cur);
  }
  return crawlBack;
}

//a* algorithm
function AStar(grid, start, end, diagnol, heuristic) {
  console.log("1");
  var startDate = new Date();
  initialize(grid);
  var openList = [];
  var nodesVisited = [];
  openList.push(grid[start[0][0]][start[0][1]]);
  while (openList.length > 0) {
    //get index of lowest f(x)
    var LowIndex = 0;
    for (var i = 0; i < openList.length; i++) {
      if (openList[i].f < openList[LowIndex].f) {
        LowIndex = i;
      }
    }
    var curr = openList[LowIndex];
    //Case 1: if destination is found

    if (curr === grid[end[0][0]][end[0][1]]) {
      curr.isVisited = true;
      grid[curr.row][curr.col] = curr;
      var cur = curr;
      var path = [];
      while (cur.parent) {
        path.push(cur);
        cur = cur.parent;
      }
      var endDate = new Date();
      var diff = Math.abs(startDate - endDate);
      return { path, nodesVisited, diff }; //retrace path
    }
    console.log("diagnol choosen 0")
    //case 2:normal case - remove node from open and mark as close, and process its neighbours
    remove(openList, curr);
    nodesVisited.push(curr);
    curr.closed = true;
    grid[curr.row][curr.col] = curr;
    if(!diagnol)
    {
      console.log("diagnol choosen")
      var neighbours = getNeighbours(grid, curr); //get list of neighbours
    }
    else {
      console.log("diagnol choosen")
      var neighbours = getNeighboursDiagnol(grid, curr);
    }
    for (i = 0; i < neighbours.length; i++) {
      var neighbour = neighbours[i]; //for each neighbour
      if (neighbour.closed || neighbour.isWall) {
        //not a valid node
        continue;
      }

      //g is shortest distance from start to current node
      var gValue = curr.g + 1; //1 is distance from node to neighbour
      var IsBestgValue = false;
      if (!neighbour.isVisited) {
        IsBestgValue = true;
        if(heuristic)
          neighbour.h = heuristicEuclidean(neighbour, grid[end[0][0]][end[0][1]]);
        else if(!(heuristic) && !(diagnol))
          neighbour.h = heuristicManhattan(neighbour, grid[end[0][0]][end[0][1]]); //get heuristic value
        else if(!(heuristic) && diagnol)
          neighbour.h = heuristicDiagnol(neighbour, grid[end[0][0]][end[0][1]]);
        neighbour.isVisited = true;
        openList.push(neighbour);
        nodesVisited.push(neighbour);
      } else if (gValue < neighbour.g) {
        IsBestgValue = true;
      }
      if (IsBestgValue) {
        neighbour.parent = curr;
        neighbour.g = gValue;
        neighbour.f = neighbour.g + neighbour.h;
      }
      grid[neighbour.row][neighbour.col] = neighbour;
    }
  }
}
export default AStar;
