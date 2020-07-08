import React, { useState } from "react";
import Node from "./Node.jsx";
import Dijikstra from "./dijikstra.jsx";
import { Button, Modal, ButtonGroup, ToggleButton, Nav } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
var source = false;
function PathFinder() {
  var cells = [];
  const [mousePressed, isMousePressed] = useState(false);
  const [endPressed, isEndPressed] = useState(false);
  const [sourcePressed, isSourcePressed] = useState(false);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  for (let i = 0; i < 22; i++) {
    var rows = [];
    for (let j = 0; j < 30; j++) {
      var cur = {
        row: i,
        col: j,
        isStart: i === 10 && j === 5,
        isFinish: i === 10 && j === 24,
        distance: Infinity,
        isVisited: false,
        isWall: false,
        parent: null,
        pathChange: false,
        visChange: false,
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
    var temp = Dijikstra(grid, start, ends);
    var path = temp.crawlBack;
    path.reverse();
    var visited = temp.nodesVisted;
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

  function addRandomWalls() {
    console.log(1);
    var newCells = grid.slice();
    var row;
    var col;
    var i;
    for (i = 0; i < 50; i++) {
      row = Math.floor(Math.random() * (21 - 0));
      col = Math.floor(Math.random() * (29 - 0));
      if (!grid[row][col].isStart && !grid[row][col].isFinish) {
        newCells[row][col] = { isWall: true };
        makegrid(newCells);
      }
    }
  }
  function addEnds() {
    isEndPressed(true);
    isSourcePressed(false);
    var ends = [[10, 24]];
  }

  function addSources() {
    isSourcePressed(true);
    isEndPressed(false);
    var sources = [[10, 5]];
  }

  function OnMouseUp(cell) {
    if (source) {
      var newCells = grid.slice();
      newCells[cell.row][cell.col] = { ...cell, isStart: true, isWall: false };

      makegrid(newCells);
    }
    source = false;
    isMousePressed(false);
  }
  function OnMouseLeave(cell) {
    if (source) {
      var newCells = grid.slice();
      newCells[cell.row][cell.col] = { ...cell, isStart: false };
      makegrid(newCells);
    }
  }
  function OnMouseDown(cell) {
    var newCells = grid.slice();
    if (endPressed) newCells[cell.row][cell.col] = { ...cell, isFinish: true };
    else if (sourcePressed)
      newCells[cell.row][cell.col] = { ...cell, isStart: true };
    else if (cell.isStart) {
      source = true;
    } else newCells[cell.row][cell.col] = { ...cell, isWall: true };
    makegrid(newCells);
    isMousePressed(true);
  }

  function OnMouseEnter(cell) {
    if (mousePressed) {
      var newCells = grid.slice();
      if (endPressed)
        newCells[cell.row][cell.col] = { ...cell, isFinish: true };
      else if (source) {
        newCells[cell.row][cell.col] = { ...cell, isStart: true };
      } else if (sourcePressed)
        newCells[cell.row][cell.col] = { ...cell, isStart: true };
      else
        newCells[cell.row][cell.col] = {
          ...newCells[cell.row][cell.col],
          isWall: true,
        };
      makegrid(newCells);
    }
  }

  return (
    <div>
      <Navbar className="nav-bar" variant="light" expand="lg">
        <Navbar.Brand>Path Finder</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link onClick={addWalls}>Add Walls</Nav.Link>
            <Nav.Link onClick={addSources}>Add Sources</Nav.Link>
            <Nav.Link onClick={addEnds}>Add destination</Nav.Link>
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
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
export default PathFinder;
