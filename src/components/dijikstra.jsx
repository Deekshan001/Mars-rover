function isSafe(x, y, cells) {
  if (x >= 0 && y >= 0 && x < 22 && y < Math.floor(window.screen.availWidth / 25) - 1 && cells[x][y].isWall === false)
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

function Dijikstra(cells, start, ends, allDrifts,option) {
  var StartTime = new Date();
  var cur = null;
  var nodesVisited = [];
  var remainingEnds = ends.length;
  var refTime = 0;
  var path = [];
  var changeEnds = [];
  var no_of_adjacent;
  var dx;
  var dy;
  var n=0;
  for (let i = 0; i < start.length; i++) {
    cur = cells[start[i][0]][start[i][1]];
    cur.distance = 0;
    cells[cur.row][cur.col] = cur;
  }
  nodesVisited.push(cells[start[0][0]][start[0][1]]);
  cells[start[0][0]][start[0][1]].isVisited = true;
//option
    if(option===false)
    {
      dx = [-1, 1, 0, 0];
      dy = [0, 0, -1, 1];
      no_of_adjacent=4;
    }
    else
    {
      dx = [-1, 1, 0, 0,-1,-1, 1, 1];
      dy = [0, 0, -1, 1,-1, 1,-1, 1];
      no_of_adjacent=8;
    }
  while (cur !== null) {
    for (let i = 0; i < no_of_adjacent; i++) {
      var x = cur.row + dx[i];
      var y = cur.col + dy[i];
      var d = cur.distance + 1;
      var c1 = cur;
      if (isSafe(x, y, cells)) {
        if (cells[x][y].isDrift) {
          var j = cells[x][y].driftNo - 1;
          var r, c;
          for (let i = 0; i < allDrifts[j].length; i++) {
            r = allDrifts[j][i].row;
            c = allDrifts[j][i].col;
            if (cells[r][c].distance > d) {
              cells[r][c].distance = d;
              cells[r][c].parent = c1;
            }
            nodesVisited.push(cells[r][c]);
            cells[r][c].isVisited = true;
            d += 1;
            c1 = cells[r][c];
          }

          for (let i = 0; i < no_of_adjacent; i++) {
            var x1 = r + dx[i];
            var y1 = c + dy[i];
            if (isSafe(x1, y1, cells)) {
              if (cells[x1][y1].distance > cells[r][c].distance + 1) {
                cells[x1][y1].distance = cells[r][c].distance + 1;
                cells[x1][y1].parent = cells[r][c];
              }
            }
          }
        } else {
          if (cells[x][y].distance > cur.distance + 1) {
            cells[x][y].distance = cur.distance + 1;
            cells[x][y].parent = cur;
          }
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
        changeEnds.push(cur);
        path = path.concat(crawlBack(cur).reverse());

        var refStart = new Date();
        gridreset(cells);
        var refEnd = new Date();
        refTime += refEnd - refStart;
        if (path[n] != null) {
          var x = [path[n].row, path[n].col];
          n = path.length - 1;

          for (let j = 0; j < start.length; j++) {
            if (x[0] == start[j][0] && x[1] == start[j][1]) start.splice(j, 1);
            else cells[start[j][0]][start[j][1]].distance = 0;
          }
        }
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
  var diff = EndTime - StartTime - refTime;
  for (let i = 0; i < changeEnds.length; i++) {
    changeEnds[i].isFinish = true;
  }

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
