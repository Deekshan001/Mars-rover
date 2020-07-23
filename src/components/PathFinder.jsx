import React, { useState } from "react";
import Node from "./Node.jsx";
import Dijikstra from "./dijikstra.jsx";
import AStar from "./AStar.js";
import { Button, Modal, Nav, NavDropdown } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";

//Images used
import algo from "./images/algo.gif";
import startNode from "./images/start.jpg";
import wallNode from "./images/blacknode.jpg";
import endNode from "./images/dest.jpg";
import pathNode from "./images/pathNode.jpg";
import visitedNode from "./images/visitedNode.jpg";
import driftNode from "./images/driftNode.jpg";
import wallsgif from "./images/Walls.gif";
import randomWallsGif from "./images/randomwalls.gif";
import srcDestGif from "./images/src-dest.gif";
import driftsGif from "./images/drifts.gif";
import logo from "../images/start.jpg";

var source = false;
var destination = false;
var walls = false;
var time = 0;
var pathLen = 0;
var drifts = [];
var driftIndex = 1;
var allDrifts = [];
var path = [];
var visited = [];
function PathFinder() {
  var cells = [];
  //Handle mouse activity
  const [mousePressed, isMousePressed] = useState(false);
  const [endPressed, isEndPressed] = useState(false);
  const [sourcePressed, isSourcePressed] = useState(false);
  const [driftPressed, isDriftPressed] = useState(false);

  const [AstarSel, isAstarClicked] = useState(false);

  //Handle Heuristics
  const [diagClicked, isDiagMovementClicked] = useState(false);
  const [euclidClicked, isEuclidianClicked] = useState(false);
  const [chebyshevClicked, isChebyshevClicked] = useState(false);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  const [show3, setShow3] = useState(false);
  const handleClose3 = () => setShow3(false);
  const handleShow3 = () => setShow3(true);
  //Initialize Grid
  var ncol = Math.floor(window.screen.availWidth / 25) - 1;
  var nrow = Math.floor((window.screen.availHeight - 175) / 25) - 1;
  for (let i = 0; i < nrow; i++) {
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
      if(start.length>1)
      { handleShow3();
        return;}

      temp = AStar(
        grid,
        start,
        ends,
        diagClicked,
        euclidClicked,
        chebyshevClicked,
        allDrifts
      );
      path = temp.path;
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
          if (path[0] === null) {
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
        if (path[i] === null) {
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
    if (visited.length !== 0 || path.length !== 0) handleShow2();
    else visualize();
  }
  function reset() {
    window.location.reload(false);
  }

  function setTimeandPathLen() {
    const list = document.querySelector(".list");
    list.children[0].innerHTML = "Time:" + time + "ms";
    list.children[1].innerHTML = "PathLen:" + pathLen;
  }

  //Random Walls
  function addRandomWalls() {
    var row;
    var col;
    var i;
    var j;
    for (i = 0; i < nrow; i++) {
      for (j = 0; j < ncol; j++) {
        grid[i][j].isWall = false;
      }
    }
    for (i = 0; i < 100; i++) {
      row = Math.floor(Math.random() * (nrow - 0));
      col = Math.floor(Math.random() * (ncol - 0));
      if (!grid[row][col].isStart && !grid[row][col].isFinish) {
        grid[row][col].isWall = true;
      }
    }
  }

  //Handle each of the additions [Walls, Sources, Destinations, Drifts]
  function addWalls() {
    isEndPressed(false);
    isSourcePressed(false);
    isDriftPressed(false);
  }

  function addEnds() {
    isEndPressed(true);
    isSourcePressed(false);
    isDriftPressed(false);
  }

  function addSources() {
    isSourcePressed(true);
    isEndPressed(false);
    isDriftPressed(false);
  }

  function addDrift() {
    isDriftPressed(true);
    isSourcePressed(false);
    isEndPressed(false);
  }

  //Description box
  function popup() {
    const div = document.querySelector("#firstpage");
    div.style.display = "block";
  }

  function actioPerformed(page, action) {
    if (action === "skip") {
      const div1 = document.querySelectorAll(".contain2");
      for (var i = 0; i < div1.length; i++) div1[i].style.display = "none";
    } else if (page === "first" && action === "next") {
      const div1 = document.querySelector("#secondpage");
      const div2 = document.querySelector("#firstpage");
      div1.style.display = "block";
      div2.style.display = "none";
    } else if (page === "second" && action === "next") {
      const div1 = document.querySelector("#thirdpage");
      const div2 = document.querySelector("#secondpage");
      div1.style.display = "block";
      div2.style.display = "none";
    } else if (page === "second" && action === "previous") {
      const div1 = document.querySelector("#firstpage");
      const div2 = document.querySelector("#secondpage");
      div1.style.display = "block";
      div2.style.display = "none";
    } else if (page === "third" && action === "next") {
      const div1 = document.querySelector("#fourthpage");
      const div2 = document.querySelector("#thirdpage");
      div1.style.display = "block";
      div2.style.display = "none";
    } else if (page === "third" && action === "previous") {
      const div1 = document.querySelector("#secondpage");
      const div2 = document.querySelector("#thirdpage");
      div1.style.display = "block";
      div2.style.display = "none";
    } else if (page === "fourth" && action === "next") {
      const div1 = document.querySelector("#fifthpage");
      const div2 = document.querySelector("#fourthpage");
      div1.style.display = "block";
      div2.style.display = "none";
    } else if (page === "fourth" && action === "previous") {
      const div1 = document.querySelector("#thirdpage");
      const div2 = document.querySelector("#fourthpage");
      div1.style.display = "block";
      div2.style.display = "none";
    } else if (page === "fifth" && action === "next") {
      const div1 = document.querySelector("#sixthpage");
      const div2 = document.querySelector("#fifthpage");
      div1.style.display = "block";
      div2.style.display = "none";
    } else if (page === "fifth" && action === "previous") {
      const div1 = document.querySelector("#fourthpage");
      const div2 = document.querySelector("#fifthpage");
      div1.style.display = "block";
      div2.style.display = "none";
    } else if (page === "sixth" && action === "next") {
      const div1 = document.querySelector("#seventhpage");
      const div2 = document.querySelector("#sixthpage");
      div1.style.display = "block";
      div2.style.display = "none";
    } else if (page === "sixth" && action === "previous") {
      const div1 = document.querySelector("#fifthpage");
      const div2 = document.querySelector("#sixthpage");
      div1.style.display = "block";
      div2.style.display = "none";
    } else if (page === "seventh" && action === "next") {
      const div1 = document.querySelector("#eighthpage");
      const div2 = document.querySelector("#seventhpage");
      div1.style.display = "block";
      div2.style.display = "none";
    } else if (page === "seventh" && action === "previous") {
      const div1 = document.querySelector("#sixthpage");
      const div2 = document.querySelector("#seventhpage");
      div1.style.display = "block";
      div2.style.display = "none";
    } else if (page === "eighth" && action === "finish") {
      const div1 = document.querySelector("#eighthpage");
      div1.style.display = "none";
    } else if (page === "eighth" && action === "previous") {
      const div1 = document.querySelector("#seventhpage");
      const div2 = document.querySelector("#eighthpage");
      div1.style.display = "block";
      div2.style.display = "none";
    }
  }

  //Handle heuristic
  function heuristicChebyshevClicked(bool) {
    isEuclidianClicked(false);
    isChebyshevClicked(bool);
  }

  //Mouse Handlers
  function OnMouseUp(cell) {
    var newCells = grid.slice();
    if (source) {
      newCells[cell.row][cell.col] = { ...cell, isStart: true, isWall: false };
      source = false;
    } else if (destination) {
      newCells[cell.row][cell.col] = { ...cell, isFinish: true, isWall: false };
      destination = false;
    } else if (driftPressed) {
      newCells[cell.row][cell.col] = {
        ...cell,
        isDrift: true,
        driftNo: driftIndex,
      };
      allDrifts.push(drifts);
      driftIndex += 1;
      drifts = [];
    } else if (walls) walls = false;
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
    } else if (cell.isWall) {
      newCells[cell.row][cell.col] = { ...cell, isWall: false };
      walls = true;
    } else {
      newCells[cell.row][cell.col] = { ...cell, isWall: true };
    }
    makegrid(newCells);
    isMousePressed(true);
  }

  function OnMouseEnter(cell) {
    if (mousePressed && cell.row !== undefined) {
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
      } else if (walls) {
        newCells[cell.row][cell.col] = {
          ...newCells[cell.row][cell.col],
          isWall: false,
        };
      } else if (!cell.isStart && !cell.isFinish)
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

      {/* Description box */}
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
              Description" button below. Otherwise, press "Next"!
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
            <div width="50px"></div>
            <button
              className="btn btn-outline-light float-right "
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
              All of the algorithms on this application are designed for a 2D
              grid, where 90 degree turns have a "cost" of 1 and movements from
              a node to another have a "cost" of 1.
            </p>
            <ul id="secondul">
              <li>
                <img
                  alt="Start"
                  src={startNode}
                  width="30px"
                  height="30px"
                ></img>{" "}
                Start Node
              </li>
              <li>
                <img alt="End" src={endNode} width="30px" height="30px"></img>{" "}
                Destination
              </li>
              <li>
                <img alt="Wall" src={wallNode} width="30px" height="30px"></img>{" "}
                Wall Node
              </li>
              <li>
                <img
                  alt="Drift"
                  src={driftNode}
                  width="30px"
                  height="30px"
                ></img>{" "}
                Drift Node
              </li>
              <li>
                <img
                  alt="Visited"
                  src={visitedNode}
                  width="30px"
                  height="30px"
                ></img>{" "}
                Visited Node
              </li>
              <li>
                <img alt="Path" src={pathNode} width="30px" height="30px"></img>{" "}
                Path Node
              </li>
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

      <div className="contain2" id="thirdpage">
        <div className="list2">
          <header align="center">Add Random Walls</header>
          <section>
            <p className="secP">
              Clicking the option "Add Random Walls" from NavBar,{" "}
              <strong>results in walls at random positions</strong> of the grid.
              <br />
              <br />
              <img
                alt="walls"
                src={randomWallsGif}
                width="500px"
                height="250px"
              ></img>
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

      <div className="contain2" id="fourthpage">
        <div className="list2">
          <header align="center">Add Walls</header>
          <section>
            <p className="secP">
              Wall obstacles are impenetrable, i.e. paths cannot cross through
              them. Click on option "Add Walls" from NavBar then click and drag
              to add walls on the grid.
              <br /> <br />
              <img alt="walls" src={wallsgif}></img>
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
              onClick={() => actioPerformed("fourth", "next")}
            >
              Next
            </button>
          </footer>
        </div>
      </div>

      <div className="contain2" id="fifthpage">
        <div className="list2">
          <header align="center">Add Source / Add Destination</header>
          <section>
            <p className="secP">
              Click on option "Add Source" or "Add Destination" from NavBar,
              then click and drag to add Source or Destination on the grid.
              <img alt="" src={srcDestGif} width="500px" height="200px"></img>
            </p>
          </section>
          <footer display="grid">
            <button
              className="btn btn-outline-light"
              type="button"
              onClick={() => actioPerformed("fifthpage", "skip")}
            >
              Skip Description
            </button>
            <button
              className="btn btn-outline-light"
              type="button"
              onClick={() => actioPerformed("fifth", "previous")}
            >
              Previous
            </button>
            <button
              className="btn btn-outline-light"
              type="button"
              onClick={() => actioPerformed("fifth", "next")}
            >
              Next
            </button>
          </footer>
        </div>
      </div>

      <div className="contain2" id="sixthpage">
        <div className="list2">
          <header align="center">Add Drift</header>
          <section>
            <p className="secP">
              On clicking the option "Add Drift". Click and drag to add drift on
              the grid. These are air columns where once a node enters the drift
              it is pushed away to the end of the column.
              <img
                alt="drifts"
                src={driftsGif}
                width="500px"
                height="250px"
              ></img>
            </p>
          </section>
          <footer display="grid">
            <button
              className="btn btn-outline-light"
              type="button"
              onClick={() => actioPerformed("sixthpage", "skip")}
            >
              Skip Description
            </button>
            <button
              className="btn btn-outline-light"
              type="button"
              onClick={() => actioPerformed("sixth", "previous")}
            >
              Previous
            </button>
            <button
              className="btn btn-outline-light"
              type="button"
              onClick={() => actioPerformed("sixth", "next")}
            >
              Next
            </button>
          </footer>
        </div>
      </div>
      <div className="contain2" id="seventhpage">
        <div className="list2">
          <header align="center">Picking an Algorithm</header>
          <section>
            <p className="secP">
              Choose an algorithm from the "Algorithms" drop-down menu. You can
              visualize Dijkstra's Algorithm and A star search both with or
              without diagonal movements options. Multiple sources works only
              with Dijikstra and the first source alone is considered in A Star.
              <br /> <br />
              <img alt="algo" src={algo}></img>
            </p>
          </section>
          <footer display="grid">
            <button
              className="btn btn-outline-light"
              type="button"
              onClick={() => actioPerformed("seventhpage", "skip")}
            >
              Skip Description
            </button>
            <button
              className="btn btn-outline-light"
              type="button"
              onClick={() => actioPerformed("seventh", "previous")}
            >
              Previous
            </button>
            <button
              className="btn btn-outline-light"
              type="button"
              onClick={() => actioPerformed("seventh", "next")}
            >
              Next
            </button>
          </footer>
        </div>
      </div>

      <div className="contain2" id="eighthpage">
        <div className="list2">
          <header align="center">Visualizing and more</header>
          <section>
            <p>Use the navbar buttons to visualize algorithms</p>
            <p className="secP">
              You can addWalls, addRandomWalls, addDrifts , reset the entire
              board, choose diffenent algorithms, all from the navbar. If you
              want to access this description again, click on "Description".
            </p>
            <p className="secP">
              Access the source code{" "}
              <a
                className="link"
                href="https://github.com/Deekshan001/Mars-rover"
              >
                here
              </a>
            </p>
          </section>
          <footer display="grid">
            <button
              className="btn btn-outline-light"
              type="button"
              onClick={() => actioPerformed("eighthpage", "skip")}
            >
              Skip Description
            </button>
            <button
              className="btn btn-outline-light"
              type="button"
              onClick={() => actioPerformed("eighth", "previous")}
            >
              Previous
            </button>
            <button
              className="btn btn-outline-light"
              type="button"
              onClick={() => actioPerformed("eighth", "finish")}
            >
              Finish
            </button>
          </footer>
        </div>
      </div>

      <Navbar className="nav-bar" variant="dark" expand="lg">
        <Navbar.Brand>
          <img alt="logo" src={logo} width="55px"></img>Curiosity
        </Navbar.Brand>
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
                className="Dropdownmenuclass"
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
                className="Dropdownmenuclass"
                title="A Star"
                id="basic-nav-dropdown"
                onClick={() => isAstarClicked(true)}
              >
                <NavDropdown.Header variant="dark">OPTIONS</NavDropdown.Header>
                <NavDropdown
                  drop="right"
                  className="Dropdownmenuclass"
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
                  className="Dropdownmenuclass"
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

      {/*Handle Path not found*/}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Unreachable!!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Path doesn't exist between the given source and destination
        </Modal.Body>
      </Modal>

      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>Illegal Search</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Kindly reset the grid before starting search again!!
        </Modal.Body>
      </Modal>

      <Modal show={show3} onHide={handleClose3}>
        <Modal.Header closeButton>
          <Modal.Title>Not Possible!!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Kindly use the dijikstras algorithm if there are multiple sources!!
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
