function initialize(grid) {
  var x = 0;
  var y = 0;
  for (x = 0; x < grid.length; x++) {
    for (y = 0; y < grid[x].length; y++) {
      grid[x][y].f = 0;
      grid[x][y].distance = 0;
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
  if (
    x >= 0 &&
    y >= 0 &&
    x < Math.floor((window.screen.availHeight - 175) / 25) - 1 &&
    y < Math.floor(window.screen.availWidth / 25) - 1 &&
    cells[x][y].isWall === false
  )
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
function heuristicChebyshev(node1, node2) {
  return (
    Math.abs(node1.row - node2.row) +
    Math.abs(node1.col - node2.col) -
    Math.min(Math.abs(node1.row - node2.row), Math.abs(node1.col - node2.col))
  );
}
function heuristicOctile(node1, node2) {
  return (
    Math.abs(node1.row - node2.row) +
    Math.abs(node1.col - node2.col) +
    (2 - Math.sqrt(2)) *
      Math.min(Math.abs(node1.row - node2.row), Math.abs(node1.col - node2.col))
  );
}
//function to calculate heuristic value
function heuristicEuclidean(node1, node2) {
  return Math.sqrt(
    Math.pow(node1.row - node2.row, 2) + Math.pow(node1.col - node2.col, 2)
  );
}
function nearestEnd(grid, cur, diagnol, heuristic, heuristic2, end) {
  var ans = null;
  var min = null,
    minNode = null;
  for (let i = 0; i < end.length; i++) {
    let node = grid[end[i][0]][end[i][1]];
    if (heuristic) ans = heuristicEuclidean(cur, node);
    else if (!heuristic && !diagnol) ans = heuristicManhattan(cur, node);
    else if (!heuristic && diagnol && heuristic2)
      ans = heuristicChebyshev(cur, node);
    else if (!heuristic && diagnol && !heuristic2)
      ans = heuristicOctile(cur, node);
    if (min === null || ans < min) {
      min = ans;
      minNode = node;
    }
  }
  return minNode;
}

function remove(list, item) {
  var x = list.indexOf(item);
  list.splice(x, 1); //removes item at index x
}

function main(
  grid,
  start,
  end,
  diagnol,
  heuristic,
  heuristic2,
  allDrifts,
  openList,
  curEnd
) {
  let path = [];
  let nodesVisited = [];
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
    if (curr === grid[curEnd.row][curEnd.col]) {
      curr.isVisited = true;
      grid[curr.row][curr.col] = curr;
      var cur = curr;
      while (cur.parent) {
        path.push(cur);
        cur = cur.parent;
      }
      path.push(grid[start[0][0]][start[0][1]]);

      return { path, nodesVisited }; //retrace path
    }

    //case 2:normal case - remove node from open and mark as close, and process its neighbours
    var neighbours;
    remove(openList, curr);
    nodesVisited.push(curr);
    curr.closed = true;
    curr.isVisited = true;
    grid[curr.row][curr.col] = curr;

    if (curr.isDrift) {
      neighbours = allDrifts[curr.driftNo - 1];
      cur = null;
      var d = curr.distance;
      var p = curr;
      for (i = 1; i < neighbours.length; i++) {
        cur = grid[neighbours[i].row][neighbours[i].col];
        nodesVisited.push(cur);
        cur.closed = true;
        cur.isVisited = true;
        cur.distance = d;
        cur.parent = p;
        grid[neighbours[i].row][neighbours[i].col] = cur;
        p = cur;
        d += 1;
      }
      i = neighbours.length - 1;
      curr = grid[neighbours[i].row][neighbours[i].col];
    }

    if (!diagnol) {
      neighbours = getNeighbours(grid, curr); //get list of neighbours
    } else {
      neighbours = getNeighboursDiagnol(grid, curr);
    }

    for (i = 0; i < neighbours.length; i++) {
      var neighbour = neighbours[i]; //for each neighbour
      if (neighbour.closed || neighbour.isWall) {
        //not a valid node
        continue;
      }
      //distance is shortest distance from start to current node
      var gValue = curr.distance + 1; //1 is distance from node to neighbour
      var IsBestgValue = false;
      if (!neighbour.isVisited) {
        IsBestgValue = true;
        if (heuristic)
          neighbour.h = heuristicEuclidean(
            neighbour,
            grid[curEnd.row][curEnd.col]
          );
        else if (!heuristic && !diagnol)
          neighbour.h = heuristicManhattan(
            neighbour,
            grid[curEnd.row][curEnd.col]
          );
        //get heuristic value
        else if (!heuristic && diagnol && heuristic2)
          neighbour.h = heuristicChebyshev(
            neighbour,
            grid[curEnd.row][curEnd.col]
          );
        else if (!heuristic && diagnol && !heuristic2)
          neighbour.h = heuristicOctile(
            neighbour,
            grid[curEnd.row][curEnd.col]
          );
        neighbour.isVisited = true;
        openList.push(neighbour);
        nodesVisited.push(neighbour);
      } else if (gValue < neighbour.distance) {
        IsBestgValue = true;
      }
      if (IsBestgValue) {
        neighbour.parent = curr;
        neighbour.distance = gValue;
        neighbour.f = neighbour.distance + neighbour.h;
      }
      grid[neighbour.row][neighbour.col] = neighbour;
    }
  }
  return { path, nodesVisited };
}
var startDate, diff, endDate;
//a* algorithm
function AStar(grid, start, end, diagnol, heuristic, heuristic2, allDrifts) {
  startDate = new Date();
  initialize(grid);
  var openList = [];
  openList.push(grid[start[0][0]][start[0][1]]);
  var remEnds = end.length;
  var curEnd = nearestEnd(
    grid,
    grid[start[0][0]][start[0][1]],
    diagnol,
    heuristic,
    heuristic2,
    end
  );
  var path1 = [],
    nodesVisited1 = [];
  while (remEnds > 0) {
    var { path, nodesVisited } = main(
      grid,
      start,
      end,
      diagnol,
      heuristic,
      heuristic2,
      allDrifts,
      openList,
      curEnd,
      remEnds
    );

    path1 = path1.concat(path.reverse());
    nodesVisited1 = nodesVisited1.concat(nodesVisited);

    remEnds--;
    if (remEnds > 0) {
      initialize(grid);
      openList = [];
      openList.push(curEnd);
      var newEnds = [];
      for (let j = 0; j < end.length; j++) {
        if (end[j][0] !== curEnd.row || end[j][1] !== curEnd.col)
          newEnds.push(end[j]);
      }
      end = newEnds.slice();
      curEnd.parent = null;
      grid[curEnd.row][curEnd.col] = curEnd;
      curEnd = nearestEnd(grid, curEnd, diagnol, heuristic, heuristic2, end);
    }
    endDate = new Date();
    diff = Math.abs(startDate - endDate);
  }
  path = path1.slice();
  nodesVisited = nodesVisited1.slice();
  return { path, nodesVisited, diff }; //ret
}
export default AStar;
