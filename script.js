const gridtopCan = document.getElementById("gridtop");
const gridbgCan = document.getElementById("gridbg");
const gridtopCtx = gridtopCan.getContext("2d");
const gridbgCtx = gridbgCan.getContext("2d");

const GRID_LINE_COUNT = 30;
const CENTER_SQ_DIM = 10;
function drawGrid(ctx) {
  let lineGap = ctx.canvas.width / GRID_LINE_COUNT;
  ctx.fillStyle = "black";
  for (let i = 0; ; i++) {
    const coord = (lineGap * i) - Math.max(ctx.canvas.width, ctx.canvas.height);
    if (coord > (ctx.canvas.width * 2) && coord > (ctx.canvas.height * 2)) break;
    const bigger = i % 2 === 0;
    const thickness = bigger ? 4.4 : 2;
    ctx.fillRect(coord + ctx.canvas.height, -ctx.canvas.height, thickness, ctx.canvas.height * 8); // vertical line
    ctx.fillRect(-ctx.canvas.width, coord,  ctx.canvas.width * 8, thickness); // horizontal line
  }

  // draw square in center
  ctx.fillStyle = "blue";
  ctx.fillRect(
    (ctx.canvas.width / 2) - (CENTER_SQ_DIM / 2),
    (ctx.canvas.height / 2) - (CENTER_SQ_DIM / 2),
    CENTER_SQ_DIM,
    CENTER_SQ_DIM
  );
}

function docNum(id) {
  const ele = document.getElementById(id);
  let num = parseFloat(ele.value, 10);
  if (Number.isNaN(num)) num = 0;
  return num;
}

if (location.hash[0] === "#") {
  const parts = location.hash.slice(1)
    .split(",")
    .map(part => parseFloat(part, 10))
    .filter(part => !Number.isNaN(part));
  if (parts.length === 4) {
    document.getElementById("m11").value = parts[0];
    document.getElementById("m12").value = parts[1];
    document.getElementById("m21").value = parts[2];
    document.getElementById("m22").value = parts[3];
  }
}
function getMatrix() {
  return [
    docNum("m11"), docNum("m12"), docNum("m21"), docNum("m22")
  ];
}

setInterval(() => {
  const matrix = getMatrix();
  const newHash = matrix.map(num => num.toFixed(3)).join(",");
  if (location.hash !== newHash) location.hash = newHash;
}, 1500);

let resizePending = true;
function eachFrame() {
  requestAnimationFrame(eachFrame);
  gridtopCtx.clearRect(0, 0, gridtopCan.width, gridtopCan.height);
  gridtopCtx.save();
  const matrix = getMatrix();
  gridtopCtx.transform.apply(gridtopCtx, matrix.concat([0, 0]));
  drawGrid(gridtopCtx);
  gridtopCtx.restore();
  if (resizePending) {
    [...document.getElementsByClassName("scrCan")].forEach(can => {
      can.width = window.innerWidth;
      can.height = window.innerHeight;
    });
    gridbgCtx.fillStyle = "#e0e0e0";
    gridbgCtx.fillRect(0, 0, gridbgCan.width, gridbgCan.height);
    drawGrid(gridbgCtx);
  }
  resizePending = false;
}
requestAnimationFrame(eachFrame);

window.addEventListener("resize", () => {
  resizePending = true;
});
