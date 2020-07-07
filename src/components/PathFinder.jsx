import React, { useState } from "react";
import Node from "./Node.jsx";
import Dijikstra from "./dijikstra.jsx";
import { Button, Modal, ButtonGroup, ToggleButton } from "react-bootstrap";

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
      const cur = {
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

  function main() {
    var start = retSources();
    var ends = retEnds();
    var temp = Dijikstra(grid, start, ends);
    var path = temp.crawlBack;
    path.reverse();
    var visited = temp.nodesVisted;
    for (let j = 0; j <= visited.length; j++) {
      if (j === visited.length) {
        if (path[0] != null) {
          setTimeout(() => {
            for (let i = 0; i < path.length; i++) {
              setTimeout(() => {
                var newCells = grid.slice();
                var cell = path[i];
                if (path[i] != null) {
                  newCells[cell.row][cell.col] = {
                    ...path[i],
                    pathChange: true,
                    visChange: false,
                  };
                  makegrid(newCells);
                } else {
                  handleShow();
                }
              }, 10 * i);
            }
          }, 10 * j);
        } else setTimeout(() => handleShow(), 15 * j);
      } else {
        setTimeout(() => {
          var newCells = grid.slice();
          var cell = visited[j];
          newCells[cell.row][cell.col] = { ...visited[j], visChange: true };
          makegrid(newCells);
        }, 10 * j);
      }
    }
  }
  function addWalls() {
    isEndPressed(false);
    isSourcePressed(false);
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

  function OnMouseUp() {
    isMousePressed(false);
  }

  function OnMouseDown(cell) {
    var newCells = grid.slice();
    if (endPressed) newCells[cell.row][cell.col] = { ...cell, isFinish: true };
    else if (sourcePressed)
      newCells[cell.row][cell.col] = { ...cell, isStart: true };
    else newCells[cell.row][cell.col] = { ...cell, isWall: true };
    makegrid(newCells);
    isMousePressed(true);
  }

  function OnMouseEnter(cell) {
    if (mousePressed) {
      var newCells = grid.slice();
      if (endPressed)
        newCells[cell.row][cell.col] = { ...cell, isFinish: true };
      else if (sourcePressed)
        newCells[cell.row][cell.col] = { ...cell, isStart: true };
      else
        newCells[cell.row][cell.col] = {
          ...newCells[cell.row][cell.col],
          isWall: true,
        };
      makegrid(newCells);
    }
  }

  const [radioValue, setRadioValue] = useState("1");

  const radios = [
    { name: "Add Walls", value: "1" },
    { name: "Add destinations", value: "2" },
    { name: "Add Sources", value: "3" },
  ];

  return (
    <div className="container">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Unreachable!!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Path doesn't exist between the given source and destination
        </Modal.Body>
      </Modal>

      <ButtonGroup toggle>
        {radios.map((radio, idx) => (
          <ToggleButton
            key={idx}
            type="radio"
            variant="outline-dark"
            name="radio"
            value={radio.value}
            checked={radioValue === radio.value}
            onChange={(e) => setRadioValue(e.currentTarget.value)}
            onClick={() =>
              radio.value == 3
                ? addSources()
                : radio.value == 2
                ? addEnds()
                : addWalls()
            }
          >
            {radio.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
      <span className="search">
        <Button onClick={main} variant="outline-success">
          Start Search
        </Button>
      </span>

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
                onMouseUp={() => OnMouseUp()}
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
