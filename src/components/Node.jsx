import React from "react";
function f1(props) {
  const {
    isStart,
    isFinish,
    pathChange,
    visChange,
    isWall,
    onMouseDown,
    onMouseEnter,
    onMouseUp,
    cell,
  } = props;

  const moreClasses = isFinish
    ? "end-cell"
    : isWall
    ? "wall"
    : pathChange
    ? "path-cell"
    : isStart
    ? "start-cell"
    : visChange
    ? "intermediate-cell"
    : "";

  return (
    <div
      className={`cell ${moreClasses}`}
      onMouseDown={() => onMouseDown(cell)}
      onMouseEnter={() => onMouseEnter(cell)}
      onMouseUp={() => onMouseUp()}
    ></div>
  );
}
export default f1;
