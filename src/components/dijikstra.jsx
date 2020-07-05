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

function Dijikstra(cells, start, ends) {
  var cur = start;
  cur.distance = 0;
  cur.isVisited = true;
  cells[cur.row][cur.col] = cur;
  var nodesVisted = [];
  nodesVisted.push(cur);
  var dx = [-1, 1, 0, 0];
  var dy = [0, 0, -1, 1];
  while (cur !== null) {
    for (let i = 0; i < 4; i++) {
      var x = cur.row + dx[i];
      var y = cur.col + dy[i];
      if (isSafe(x, y, cells))
        if (cells[x][y].distance > cur.distance + 1) {
          cells[x][y].distance = cur.distance + 1;
          cells[x][y].parent = cur;
        }
    }
    cur = getNextNode(cells);
    if (cur !== null) {
      cur.isVisited = true;
      nodesVisted.push(cur);
    }
    if (endsvisited(ends, cells)) break;
  }

  var crawlBack = [];
  for (let i = 0; i < ends.length; i++) {
    cur = cells[ends[i][0]][ends[i][1]];
    crawlBack.push(cur);
    while (cur !== null && cur !== cells[start.row][start.col]) {
      cur = cur.parent;
      crawlBack.push(cur);
    }
  }
  return { nodesVisted, crawlBack };
}
export default Dijikstra;
