import React from "react";
function f1(props) {
  var {
    isStart,
    isFinish,
    pathChange,
    visChange,
    isWall,
    onMouseDown,
    onMouseEnter,
    onMouseUp,
    onMouseLeave,
    cell,
    isDrift,
  } = props;

  const moreClasses = isFinish
    ? "end-cell"
    : isWall
    ? "wall"
    : isDrift
    ? "drift"
    : pathChange
    ? "path-cell"
    : isStart
    ? "start-cell"
    : visChange
    ? "intermediate-cell"
    : "";

  return (
    <div
      id={`cell-${cell.row}-${cell.col}`}
      className={`cell ${moreClasses}`}
      onMouseDown={() => onMouseDown(cell)}
      onMouseEnter={() => onMouseEnter(cell)}
      onMouseUp={() => onMouseUp(cell)}
      onMouseLeave={() => onMouseLeave(cell)}
    >
      {pathChange && <hr />}
    </div>
  );
}
export default f1;
