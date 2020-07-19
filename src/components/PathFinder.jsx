import React, { useState } from "react";
import Node from "./Node.jsx";
import Dijikstra from "./dijikstra.jsx";
import AStar from "./AStar.js";
import { Button, Modal, Nav, NavDropdown } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import algo from "./drop_down1.jpg";
import algo2 from "./drop_down2.jpg";

var source = false;
var destination = false;
var time = 0;
var pathLen = 0;
var drifts = [];
var driftIndex = 1;
var allDrifts = [];
var path = [];
var visited = [];
function PathFinder() {
  var cells = [];
  const [mousePressed, isMousePressed] = useState(false);
  const [endPressed, isEndPressed] = useState(false);
  const [sourcePressed, isSourcePressed] = useState(false);
  const [driftPressed, isDriftPressed] = useState(false);
  const [AstarSel, isAstarClicked] = useState(false);
  //mine
  const [diagClicked, isDiagMovementClicked] = useState(false);
  const [euclidClicked, isEuclidianClicked] = useState(false);
  const [chebyshevClicked, isChebyshevClicked] = useState(false);
  //mine
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  var ncol = Math.floor(window.screen.availWidth / 25) - 1;
  for (let i = 0; i < 22; i++) {
    var rows = [];
    for (let j = 0; j < ncol; j++) {
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

  function visualize() {
    var start = retSources();
    var ends = retEnds();
    var temp;
    if (AstarSel) {
      console.log("1");
      temp = AStar(
        grid,
        start,
        ends,
        diagClicked,
        euclidClicked,
        chebyshevClicked
      );
      path = temp.path.reverse();
    } else {
      temp = Dijikstra(grid, start, ends, allDrifts, diagClicked);
      path = temp.path;
    }

    visited = temp.nodesVisited;
    time = temp.diff;
    pathLen = path.length - ends.length;
    setTimeandPathLen();
    animateVisited(visited, path);
  }

  function animateVisited(visited, path) {
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

  function clearpaths() {
    visited = [];
    path = [];
    var newCells = grid.slice();
    for (let i = 0; i < newCells.length; i++)
      for (let j = 0; j < newCells[i].length; j++) {
        newCells[i][j] = {
          ...newCells[i][j],
          isVisited: false,
          distance: Infinity,
        };
        if (
          !newCells[i][j].isStart &&
          !newCells[i][j].isFinish &&
          !newCells[i][j].isWall &&
          !newCells[i][j].isDrift &&
          document.getElementById(`cell-${i}-${j}`) != null
        )
          document.getElementById(`cell-${i}-${j}`).className = "cell";
        if (
          !newCells[i][j].isStart &&
          !newCells[i][j].isFinish &&
          !newCells[i][j].isWall &&
          newCells[i][j].isDrift &&
          document.getElementById(`cell-${i}-${j}`) != null
        )
          document.getElementById(`cell-${i}-${j}`).className = "cell drift";
      }
    makegrid(newCells);
  }

  function main() {
    clearpaths();
    visualize();
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
    list.children[0].innerHTML = "Time:" + time + "ms";
    list.children[1].innerHTML = "PathLen:" + pathLen;
  }
  function addRandomWalls() {
    clearpaths();
    var newCells = grid.slice();
    var row;
    var col;
    var i;
    var j;
    for (i = 0; i < 22; i++) {
      for (j = 0; j < ncol; j++) {
        grid[i][j].isWall = false;
      }
    }
    for (i = 0; i < 100; i++) {
      row = Math.floor(Math.random() * (22 - 0));
      col = Math.floor(Math.random() * (ncol - 0));
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

  function popup() {
    const div = document.querySelector("#firstpage");
    div.style.display = "block";
  }
  function actioPerformed(page, action) {
    console.log("actioPerformed", page, action);
    if (action == "skip") {
      const div1 = document.querySelectorAll(".contain2");
      for (var i = 0; i < div1.length; i++) div1[i].style.display = "none";
    } else if (page === "first" && action === "next") {
      const div1 = document.querySelector("#secondpage");
      const ul = document.querySelector("#secondul");
      ul.children[1].style.background = "#a6b1e1";
      ul.children[2].style.background = "black";
      ul.children[3].style.background = "";
      ul.children[4].style.background = "#6b0d0d";
      ul.children[4].style.border = "2px dashed brown";
      ul.children[5].style.background = "#dcd6f7";
      const div2 = document.querySelector("#firstpage");
      div1.style.display = "block";
      div2.style.display = "none";
    } else if (page == "second" && action == "next") {
      const div1 = document.querySelector("#thirdpage");
      const div2 = document.querySelector("#secondpage");
      div1.style.display = "block";
      div2.style.display = "none";
    } else if (page === "second" && action === "previous") {
      const div1 = document.querySelector("#firstpage");
      const div2 = document.querySelector("#secondpage");
      div1.style.display = "block";
      div2.style.display = "none";
    } else if (page == "third" && action == "next") {
      const div1 = document.querySelector("#fourthpage");
      const div2 = document.querySelector("#thirdpage");
      div1.style.display = "block";
      div2.style.display = "none";
    } else if (page === "third" && action === "previous") {
      const div1 = document.querySelector("#secondpage");
      const div2 = document.querySelector("#thirdpage");
      div1.style.display = "block";
      div2.style.display = "none";
    } else if (page == "fourth" && action == "finish") {
      const div1 = document.querySelector("#fourthpage");
      div1.style.display = "none";
    } else if (page === "fourth" && action === "previous") {
      const div1 = document.querySelector("#thirdpage");
      const div2 = document.querySelector("#fourthpage");
      div1.style.display = "block";
      div2.style.display = "none";
    }
  }
  function heuristicChebyshevClicked(bool) {
    isEuclidianClicked(false);
    isChebyshevClicked(bool);
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
    if (mousePressed && cell.row != undefined) {
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
    <div className="contain">
      <ul className="list">
        <li>Time:0</li>
        <li>PathLen:0</li>
      </ul>
      <div className="contain2" id="firstpage">
        <div className="list2">
          <header align="center">Welcome to Mars Rover Path Finder</header>
          <section>
            <p>
              This short tutorial will walk you through all of the features of
              this application.
            </p>
            <p className="secP">
              If you want to dive right in, feel free to press the "Skip
              Description" button below.Otherwise, press "Next"!
            </p>
          </section>
          <footer display="grid">
            <button
              className="btn btn-outline-light "
              type="button"
              onClick={() => actioPerformed("firstpage", "skip")}
            >
              Skip Description
            </button>

            <button
              className="btn btn-outline-light float-right"
              type="button"
              onClick={() => actioPerformed("first", "next")}
            >
              Next
            </button>
          </footer>
        </div>
      </div>

      <div className="contain2" id="secondpage">
        <div className="list2">
          <header align="center">Important points to be noted</header>
          <section>
            <p>
              All of the algorithms on this application are adapted for a 2D
              grid, where 90 degree turns have a "cost" of 1 and movements from
              a node to another have a "cost" of 1.
            </p>
            <ul id="secondul">
              <li>StartNode</li>
              <li>EndNode</li>
              <li>WallNode</li>
              <li>DriftNode</li>
              <li>VisitedNode</li>
              <li>PathNode</li>
            </ul>
          </section>
          <footer display="grid">
            <button
              className="btn btn-outline-light"
              type="button"
              onClick={() => actioPerformed("secondpage", "skip")}
            >
              Skip Description
            </button>
            <button
              className="btn btn-outline-light"
              type="button"
              onClick={() => actioPerformed("second", "previous")}
            >
              Previous
            </button>
            <button
              className="btn btn-outline-light"
              type="button"
              onClick={() => actioPerformed("second", "next")}
            >
              Next
            </button>
          </footer>
        </div>
      </div>

      <div className="contain2" id="fourthpage">
        <div className="list2">
          <header align="center">Visualizing and more</header>
          <section>
            <p>Use the navbar buttons to visualize algorithms</p>
            <p className="secP">
              Wall obstacles are impenetrable, i.e., paths cannot cross through
              them. Drifts are....., You can addWalls,addRandomWalls, addDrifts
              , reset the entire board, choose diffenent algorithms, all from
              the navbar. If you want to access this description again, click on
              "Description". Access the source code{" "}
              <a href="https://github.com/Deekshan001/Mars-rover">here</a>
            </p>
          </section>
          <footer display="grid">
            <button
              className="btn btn-outline-light"
              type="button"
              onClick={() => actioPerformed("fourthpage", "skip")}
            >
              Skip Description
            </button>
            <button
              className="btn btn-outline-light"
              type="button"
              onClick={() => actioPerformed("fourth", "previous")}
            >
              Previous
            </button>
            <button
              className="btn btn-outline-light"
              type="button"
              onClick={() => actioPerformed("fourth", "finish")}
            >
              Finish
            </button>
          </footer>
        </div>
      </div>

      <div className="contain2" id="thirdpage">
        <div className="list2">
          <header align="center">Picking an Algorithm</header>
          <section>
            <p className="secP">
              Choose an algorithm from the "Algorithms" drop-down menu. You can
              visualize Dijkstra's Algorithm and A star search both with or
              without diagonal movements options.
            </p>
            <p className="secP">
              You can add multiple sources and destinations but can visualize
              only with Dijkstra's algorthim.
              <img src={algo}></img>
              <img src={algo2}></img>
            </p>
          </section>
          <footer display="grid">
            <button
              className="btn btn-outline-light"
              type="button"
              onClick={() => actioPerformed("thirdpage", "skip")}
            >
              Skip Description
            </button>
            <button
              className="btn btn-outline-light"
              type="button"
              onClick={() => actioPerformed("third", "previous")}
            >
              Previous
            </button>
            <button
              className="btn btn-outline-light"
              type="button"
              onClick={() => actioPerformed("third", "next")}
            >
              Next
            </button>
          </footer>
        </div>
      </div>

      <Navbar className="nav-bar" variant="dark" expand="lg">
        <Navbar.Brand>Path Finder</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link onClick={addWalls}>Add Walls</Nav.Link>
            <Nav.Link onClick={addSources}>Add Sources</Nav.Link>
            <Nav.Link onClick={addEnds}>Add destination</Nav.Link>
            <Nav.Link onClick={addDrift}>Add Drifts</Nav.Link>
            <NavDropdown title="Algorithms" id="basic-nav-dropdown">
              <NavDropdown
                drop="right"
                classname="Dropdownmenuclass"
                title="Dijikstra"
                id="basic-nav-dropdown"
                onClick={() => isAstarClicked(false)}
              >
                <NavDropdown.Header variant="dark">OPTIONS</NavDropdown.Header>
                <NavDropdown.Item onClick={() => isDiagMovementClicked(true)}>
                  With Diagonal Movements
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => isDiagMovementClicked(false)}>
                  Without Diagonal Movements
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown
                drop="right"
                classname="Dropdownmenuclass"
                title="A Star"
                id="basic-nav-dropdown"
                onClick={() => isAstarClicked(true)}
              >
                <NavDropdown.Header variant="dark">OPTIONS</NavDropdown.Header>
                <NavDropdown
                  drop="right"
                  classname="Dropdownmenuclass"
                  title="With Diagonal Movements"
                  id="basic-nav-dropdown"
                  onClick={() => isDiagMovementClicked(true)}
                >
                  <NavDropdown.Header variant="dark">
                    HEURISTICS
                  </NavDropdown.Header>
                  <NavDropdown.Item onClick={() => isEuclidianClicked(true)}>
                    EUCLIDIAN
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => heuristicChebyshevClicked(true)}
                  >
                    CHEBYSHEV
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => heuristicChebyshevClicked(false)}
                  >
                    OCTILE
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown
                  drop="right"
                  classname="Dropdownmenuclass"
                  title="Without Diagonal Movements"
                  id="basic-nav-dropdown"
                  onClick={() => isDiagMovementClicked(false)}
                >
                  <NavDropdown.Header variant="dark">
                    HEURISTICS
                  </NavDropdown.Header>
                  <NavDropdown.Item onClick={() => isEuclidianClicked(false)}>
                    MANHATTAN
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => isEuclidianClicked(true)}>
                    EUCLIDIAN
                  </NavDropdown.Item>
                </NavDropdown>
              </NavDropdown>
            </NavDropdown>
            <Nav.Link onClick={popup}>Description</Nav.Link>
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
          <div key={rid} className="row justify-content-center">
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
