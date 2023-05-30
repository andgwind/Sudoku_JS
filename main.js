import { Sudoku } from './public/js/sudoku.js'
import { GRID_SIZE, BOX_SIZE, convertPositionToIndex, convertIndexToPosition } from './public/js/utilites.js';
import './style.scss'

const sudoku = new Sudoku();
let cells;
let selectedCell = null;
let selectedCellIndex = null;
let selectedCellFill= null;

init();

function init() {
  initCells();
  initNumbers();
  initRemover();
  initKeyEvent();
}

function initCells() {
  cells = document.querySelectorAll('.cells__item');
  fillCells();
  initCellsEvent();
}

function fillCells() {
  
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const { row, column } = convertIndexToPosition(i);

    if (sudoku.grid[row][column] !== null) {
      
      cells[i].classList.add('filled');
      cells[i].innerText = sudoku.grid[row][column];
    }
  }
}

function initCellsEvent() {
  
  cells.forEach((cell, index) => {
    cell.addEventListener('click', () => onCellClick(cell, index));
  });
}

function onCellClick(clickedCell, index) {

  // unHighLight();

  // if (clickedCell === selectedCell || selectedCellFill == clickedCell ) {
  //   return;
  // }

  cells.forEach(cell => cell.classList.remove('highlighted', 'selected', 'error'));
 
  if (clickedCell.classList.contains('filled')) {
    
    selectedCell = null;
    selectedCellIndex = null;
    selectedCellFill = clickedCell;
  } else {
    
    selectedCellFill = null;
    selectedCellIndex = index;
    selectedCell = clickedCell;
    clickedCell.classList.add('selected');
    highLightCellBy(index);
  }

  if (clickedCell.innerText === '') return;
  cells.forEach(cell => {
    if (cell.innerText === clickedCell.innerText) cell.classList.add('selected');
  });
}

// function unHighLight() {
//   cells.forEach(cell => cell.classList.remove('selected','highlighted', 'error'));
// }


function highLightCellBy(index) {
  
  highLightColumnBy(index);
  highLightRowBy(index);
  highlightBoxBy(index);
}

function highLightColumnBy(index) {
  const column = index % GRID_SIZE;

  for (let row = 0; row < GRID_SIZE; row++) {
    const cellIndex = convertPositionToIndex(row, column);
    cells[cellIndex].classList.add('highlighted');
  }
}


function highlightBoxBy(index) {
  
  const column = index % GRID_SIZE;
  const row = Math.floor(index / GRID_SIZE);
  const firstRowInBox = row - row % BOX_SIZE;
  const firstColumnInBox = column - column % BOX_SIZE;

  for (let iRow = firstRowInBox; iRow < firstRowInBox + BOX_SIZE; iRow++) {
    for (let iColumn = firstColumnInBox; iColumn < firstColumnInBox + BOX_SIZE; iColumn++) {
      const cellIndex = convertPositionToIndex(iRow, iColumn)
      cells[cellIndex].classList.add('highlighted');
    }
  }
}


function highLightRowBy(index) {
  const row = Math.floor(index / GRID_SIZE);

  for (let column = 0; column < GRID_SIZE; column++) {
    const cellIndex = convertPositionToIndex(row, column);
    cells[cellIndex].classList.add('highlighted');
  }
}

function initNumbers() {
  
  const numbers = document.querySelectorAll('.numbers__item');
  numbers.forEach(number => {
    number.addEventListener('click', () => onNumberClick(parseInt(number.innerText)));
  });

}

function onNumberClick(number) {
  
  if (!selectedCell) return;
  if (selectedCell.classList.contains('filled')) return;

  cells.forEach(cell => cell.classList.remove('error', 'zoom', 'shake', 'selected'));
  selectedCell.classList.add('selected');

  setValueInSelectedCell(number);

  if (!sudoku.hasEmptyCells()) {
    setTimeout(() => winAnimation(), 500);
  }
}

function setValueInSelectedCell(value) {
  const {row, column} = convertIndexToPosition(selectedCellIndex);
  const duplicatesPositions = sudoku.getDuplicateCoordinates(row, column, value);

  if (duplicatesPositions.length) {
    highLightDuplicates(duplicatesPositions);
    return;
  }
  sudoku.grid[row][column] = value;
  selectedCell.innerText = value;
  setTimeout(() => selectedCell.classList.add('zoom'), 0);
}

function highLightDuplicates(duplicatesPositions) {
  
  duplicatesPositions.forEach(duplicate => {
    const index = convertPositionToIndex(duplicate.row, duplicate.column);
    setTimeout(() => cells[index].classList.add('error', 'shake'), 0);
  });
}

function initRemover() {
  const buttonRemove = document.querySelector('.numbers__button-remove');
  buttonRemove.addEventListener('click', onRemoveClick);
}

function onRemoveClick() {

  if (!selectedCell) return;
  if (selectedCell.classList.contains('filled')) return;

  cells.forEach(cell => cell.classList.remove('error', 'shake', 'zoom', 'selected'));
  selectedCell.classList.add('selected');
  
  const { row, column } = convertIndexToPosition(selectedCellIndex);
  selectedCell.innerText = '';
  sudoku.grid[row][column] = null;
}
  
function initKeyEvent() {
  document.addEventListener('keydown', event => {
    const {key} = event;
    
    if ( key === 'Backspace') {
      onRemoveClick();
    } else if (key >= '1' && key <= '9') {
      onNumberClick(parseInt(key));
    }
  });
}

function winAnimation() {
  
  cells.forEach(cell => cell.classList.remove('zoom', 'selected', 'highlighted'));
  
  cells.forEach((cell, i ) => {
    setTimeout(() => cell.classList.add('highlighted', 'zoom'), i * 15);
  });

  for  (let i = 1; i < 9; i++) {
    setTimeout(() => cells.forEach(cell => cell.classList.toggle('highlighted')), 500 + cells.length * 15 + 300 * i);
  }
}