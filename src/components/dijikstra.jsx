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

function endsvisited(ends, cells) {
  var f = true;
  for (let i = 0; i < ends.length; i++) {
    if (cells[ends[i][0]][ends[i][1]].isVisited === false) f = false;
  }
  return f;
}

function Dijikstra(cells, start, ends, allDrifts) {
  var StartTime = new Date();
  console.log(StartTime);
  var cur = null;
  var nodesVisted = [];
  for (let i = 0; i < start.length; i++) {
    cur = cells[start[i][0]][start[i][1]];
    cur.distance = 0;
    cells[cur.row][cur.col] = cur;
  }
  nodesVisted.push(cells[start[0][0]][start[0][1]]);

  var dx = [-1, 1, 0, 0];
  var dy = [0, 0, -1, 1];

  while (cur !== null) {
    for (let i = 0; i < 4; i++) {
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
            nodesVisted.push(cells[r][c]);
            cells[r][c].isVisited = true;
            d += 1;
            c1 = cells[r][c];
          }

          for (let i = 0; i < 4; i++) {
            var x1 = r + dx[i];
            var y1 = c + dy[i];
            if (isSafe(x1, y1, cells)) {
              if (cells[x1][y1].isFinish) {
                cells[x1][y1].distance = 0;
                cells[x1][y1].parent = cells[r][c];
              } else if (cells[x1][y1].distance > cells[r][c].distance + 1) {
                cells[x1][y1].distance = cells[r][c].distance + 1;
                cells[x1][y1].parent = cells[r][c];
              }
            }
          }
        } else {
          if (cells[x][y].isFinish) {
            cells[x][y].distance = 0;
            cells[x][y].parent = cur;
          } else if (cells[x][y].distance > cur.distance + 1) {
            cells[x][y].distance = cur.distance + 1;
            cells[x][y].parent = cur;
          }
        }
      }
    }

    cur = getNextNode(cells);
    if (cur !== null) {
      cur.isVisited = true;
      nodesVisted.push(cur);
    }
    if (endsvisited(ends, cells)) break;
  }
  var EndTime = new Date();
  console.log(EndTime);
  var diff = EndTime - StartTime;
  diff = diff + "ms";
  console.log("diff= " + diff);
  console.log(nodesVisted);

  var crawlBack = [];
  for (let i = 0; i < ends.length; i++) {
    cur = cells[ends[i][0]][ends[i][1]];
    crawlBack.push(cur);
    while (cur !== null) {
      cur = cur.parent;
      if (cur !== null) crawlBack.push(cur);
    }
  }
  var pathlen = crawlBack.length - 1;

  return { nodesVisted, crawlBack, pathlen, diff };
}
export default Dijikstra;
