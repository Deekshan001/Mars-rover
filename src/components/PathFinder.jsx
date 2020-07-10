import React, { useState } from "react";
import Node from "./Node.jsx";
import Dijikstra from "./dijikstra.jsx";
import AStar from "./AStar.js";
import { Button, Modal, Nav } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
var source = false;
var destination = false;
var time = 0;
var pathLen = 0;
var drifts = [];
var driftIndex = 1;
var allDrifts = [];
function PathFinder() {
  var cells = [];
  const [mousePressed, isMousePressed] = useState(false);
  const [endPressed, isEndPressed] = useState(false);
  const [sourcePressed, isSourcePressed] = useState(false);
  const [driftPressed, isDriftPressed] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  for (let i = 0; i < 22; i++) {
    var rows = [];
    for (let j = 0; j < 53; j++) {
      var cur = {
        row: i,
        col: j,
        isStart: i === 10 && j === 18,
        isFinish: i === 10 && j === 34,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        parent: null,
        pathChange: false,
        visChange: false,
        isDrift: false,
        driftNo: 0,
      };
      rows.push(cur);
    }
    cells.push(rows);
  }

  const [grid, makegrid] = useState(cells);

  function retEnds() {
    var ends = [];
    for (let i = 0; i < grid.length; i++)
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j].isFinish === true) ends.push([i, j]);
      }
    return ends;
  }

  function retSources() {
    var sources = [];
    for (let i = 0; i < grid.length; i++)
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j].isStart === true) sources.push([i, j]);
      }
    return sources;
  }

  function visualizeDijkstra() {
    var start = retSources();
    var ends = retEnds();
   /*var temp = Dijikstra(grid, start, ends, allDrifts);
   var path = temp.path;
    time = temp.diff;
    pathLen = temp.path.length - ends.length;
    setTimeandPathLen();

    var visited = temp.nodesVisited;*/
    var temp = AStar(grid, start, ends);
    var path = temp.path.reverse();
     time = temp.diff;
     pathLen = temp.path.length;
     setTimeandPathLen();

     var visited = temp.nodesVisited;
    animateDijkstra(visited, path);
  }

  function animateDijkstra(visited, path) {
    for (let i = 0; i <= visited.length; i++) {
      if (i === visited.length) {
        setTimeout(() => {
          if (path[0] == null) {
            handleShow();
            return;
          }
          animatePath(path);
        }, 5 * i);
        return;
      }
      setTimeout(() => {
        const node = visited[i];
        if (!node.isStart && !node.isFinish && !node.isDrift)
          document.getElementById(`cell-${node.row}-${node.col}`).className =
            "cell intermediate-cell";
      }, 5 * i);
    }
  }

  function animatePath(path) {
    for (let i = 0; i < path.length; i++) {
      setTimeout(() => {
        const node = path[i];
        if (path[i] == null) {
          handleShow();
          return;
        }
        if (node.isDrift)
          document.getElementById(`cell-${node.row}-${node.col}`).className =
            "cell drift-path";
        else if (!node.isStart && !node.isFinish)
          document.getElementById(`cell-${node.row}-${node.col}`).className =
            "cell path-cell";
      }, 50 * i);
    }
  }

  function main() {
    visualizeDijkstra();
  }
  function addWalls() {
    isEndPressed(false);
    isSourcePressed(false);
  }
  function reset() {
    window.location.reload(false);
  }
  function setTimeandPathLen() {
    const list = document.querySelector(".list");
    list.children[0].innerHTML = "Time:" + time +"ms";
    list.children[1].innerHTML = "PathLen:" + pathLen;
  }
  function addRandomWalls() {
    console.log(1);
    var newCells = grid.slice();
    var row;
    var col;
    var i;
    var j;
    for (i = 0; i < 22; i++) {
      for (j = 0; j < 53; j++) {
        grid[i][j].isWall = false;
      }
    }
    for (i = 0; i < 50; i++) {
      row = Math.floor(Math.random() * (22 - 0));
      col = Math.floor(Math.random() * (53 - 0));
      if (!grid[row][col].isStart && !grid[row][col].isFinish) {
        newCells[row][col] = { isWall: true };
        makegrid(newCells);
      }
    }
  }
  function addEnds() {
    isEndPressed(true);
    isSourcePressed(false);
  }

  function addSources() {
    isSourcePressed(true);
    isEndPressed(false);
  }

  function addDrift() {
    isDriftPressed(true);
    isSourcePressed(false);
    isEndPressed(false);
  }

  function OnMouseUp(cell) {
    var newCells = grid.slice();
    if (source) {
      newCells[cell.row][cell.col] = { ...cell, isStart: true, isWall: false };
      source = false;
    } else if (destination) {
      newCells[cell.row][cell.col] = { ...cell, isFinish: true, isWall: false };
      destination = false;
    } else if (driftPressed) {
      drifts.push(cell);
      newCells[cell.row][cell.col] = {
        ...cell,
        isDrift: true,
        driftNo: driftIndex,
      };
      allDrifts.push(drifts);
      driftIndex += 1;
      drifts = [];
    }
    makegrid(newCells);
    isMousePressed(false);
  }
  function OnMouseLeave(cell) {
    var newCells = grid.slice();
    if (source) {
      newCells[cell.row][cell.col] = { ...cell, isStart: false };
    } else if (destination) {
      newCells[cell.row][cell.col] = { ...cell, isFinish: false };
    }
    makegrid(newCells);
  }
  function OnMouseDown(cell) {
    var newCells = grid.slice();
    if (endPressed) newCells[cell.row][cell.col] = { ...cell, isFinish: true };
    else if (sourcePressed)
      newCells[cell.row][cell.col] = { ...cell, isStart: true };
    else if (cell.isStart) {
      source = true;
    } else if (cell.isFinish) {
      destination = true;
    } else if (driftPressed) {
      drifts.push(cell);
      newCells[cell.row][cell.col] = {
        ...cell,
        isDrift: true,
        driftNo: driftIndex,
      };
    } else newCells[cell.row][cell.col] = { ...cell, isWall: true };
    makegrid(newCells);
    isMousePressed(true);
  }

  function OnMouseEnter(cell) {
    if (mousePressed) {
      var newCells = grid.slice();
      if (endPressed)
        newCells[cell.row][cell.col] = { ...cell, isFinish: true };
      else if (source)
        newCells[cell.row][cell.col] = { ...cell, isStart: true };
      else if (destination)
        newCells[cell.row][cell.col] = { ...cell, isFinish: true };
      else if (sourcePressed)
        newCells[cell.row][cell.col] = { ...cell, isStart: true };
      else if (driftPressed) {
        drifts.push(cell);
        newCells[cell.row][cell.col] = {
          ...cell,
          isDrift: true,
          driftNo: driftIndex,
        };
      } else
        newCells[cell.row][cell.col] = {
          ...newCells[cell.row][cell.col],
          isWall: true,
        };
      makegrid(newCells);
    }
  }

  return (
    <div>
      <ul className="list">
        <li>Time:0</li>
        <li>PathLen:0</li>
      </ul>

      <Navbar className="nav-bar" variant="dark" expand="lg">
        <Navbar.Brand>Path Finder</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link onClick={addWalls}>Add Walls</Nav.Link>
            <Nav.Link onClick={addSources}>Add Sources</Nav.Link>
            <Nav.Link onClick={addEnds}>Add destination</Nav.Link>
            <Nav.Link onClick={addDrift}>Add Drifts</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link onClick={addRandomWalls}>Add Random Walls</Nav.Link>
            <Nav.Link onClick={reset}>Reset Grid</Nav.Link>
            <Button onClick={main} variant="outline-success">
              Start Search
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Unreachable!!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Path doesn't exist between the given source and destination
        </Modal.Body>
      </Modal>

      <div className="grid">
        {grid.map((row, rid) => (
          <div key={rid} className="row">
            {row.map((col, cid) => (
              <Node
                key={cid}
                cell={col}
                isStart={col.isStart}
                isFinish={col.isFinish}
                pathChange={col.pathChange}
                visChange={col.visChange}
                onMouseDown={(cell) => OnMouseDown(cell)}
                onMouseEnter={(cell) => OnMouseEnter(cell)}
                onMouseUp={(cell) => OnMouseUp(cell)}
                onMouseLeave={(cell) => OnMouseLeave(cell)}
                isWall={col.isWall}
                isDrift={col.isDrift}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
export default PathFinder;
