function isSafe(x, y, cells) {
  if (x >= 0 && y >= 0 && x < 22 && y < 30 && cells[x][y].isWall === false)
    return true;
  else return false;
}

function getNextNode(cells) {
  var min = null;
  var d = Infinity;
  for (let i = 0; i < cells.length; i++)
    for (let j = 0; j < cells[0].length; j++)
      if (d > cells[i][j].distance && cells[i][j].isVisited === false) {
        d = cells[i][j].distance;
        min = cells[i][j];
      }
  return min;
}

function gridreset(cells) {
  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells[0].length; j++) {
      cells[i][j].isVisited = false;
      cells[i][j].distance = Infinity;
      cells[i][j].parent = null;
    }
  }
}

function Dijikstra(cells, start, ends) {
  var StartTime = new Date();
  console.log(StartTime);
  var cur = null;
  var nodesVisited = [];
  var remainingEnds = ends.length;
  var refTime = 0;
  var path = [];

  for (let i = 0; i < start.length; i++) {
    cur = cells[start[i][0]][start[i][1]];
    cur.distance = 0;
    cells[cur.row][cur.col] = cur;
  }
  nodesVisited.push(cells[start[0][0]][start[0][1]]);
  cells[start[0][0]][start[0][1]].isVisited = true;
  var dx = [-1, 1, 0, 0];
  var dy = [0, 0, -1, 1];

  while (cur !== null) {
    for (let i = 0; i < 4; i++) {
      var x = cur.row + dx[i];
      var y = cur.col + dy[i];
      if (isSafe(x, y, cells)) {
        if (cells[x][y].distance > cur.distance + 1) {
          cells[x][y].distance = cur.distance + 1;
          cells[x][y].parent = cur;
        }
      }
    }

    cur = getNextNode(cells);
    if (cur !== null) {
      cur.isVisited = true;
      nodesVisited.push(cur);

      if (cur.isFinish) {
        remainingEnds -= 1;
        cur.isFinish = false;
        path = path.concat(crawlBack(cur).reverse());

        var refStart = new Date();
        gridreset(cells);
        var refEnd = new Date();
        refTime += refEnd - refStart;

        cur.isVisited = true;
        cur.distance = 0;
      }
    }

    if (remainingEnds === 0) {
      break;
    }
  }

  if (cur === null) {
    path.push(null);
  }

  var EndTime = new Date();
  console.log(EndTime);
  var diff = EndTime - StartTime - refTime;
  diff = diff + "ms";
  console.log("diff= " + diff);
  return { diff, path, nodesVisited };
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

export default Dijikstra;
