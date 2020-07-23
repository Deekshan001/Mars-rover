import React from "react";
function f1(props) {
  var {
    isStart,
    isFinish,
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
    : isStart
    ? "start-cell"
    : "";

  return (
    <div
      id={`cell-${cell.row}-${cell.col}`}
      className={`cell ${moreClasses}`}
      onMouseDown={() => onMouseDown(cell)}
      onMouseEnter={() => onMouseEnter(cell)}
      onMouseUp={() => onMouseUp(cell)}
      onMouseLeave={() => onMouseLeave(cell)}
    ></div>
  );
}
export default f1;
