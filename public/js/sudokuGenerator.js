import { BOX_SIZE, GRID_SIZE } from "./utilites.js";


export function generateSudoku() {

    const sudoku = createEmptyGrid();
    resolveSudoku(sudoku);
    return removeCells(sudoku);
}

function createEmptyGrid() {
    return new Array(GRID_SIZE).fill().map(() => new Array(GRID_SIZE).fill(null));
}

export function findEmptyCell(grid) {

    for (let row = 0; row < GRID_SIZE; row++) {
        for (let column = 0; column < GRID_SIZE; column++) {

            if (grid[row][column] == null) {
                return {row, column};
            }
        }
    }
    return null;
}

function getRandomNumbers() {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    for (let i = numbers.length - 1; i >= 0; i--) {
        
        let indexRandom = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[indexRandom]] = [numbers[indexRandom], numbers[i]];
    }

    return numbers;
}

function resolveSudoku(grid) {

    const emptyCell = findEmptyCell(grid);

    if (!emptyCell) return true;
    const numbers = getRandomNumbers();


    for (let i=0; i < numbers.length; i++) {
        
        if (!validate(grid, emptyCell.row, emptyCell.column, numbers[i])) continue;

        grid[emptyCell.row][emptyCell.column] = numbers[i];

        if (resolveSudoku(grid)) return true;
        grid[emptyCell.row][emptyCell.column] = null;

    }
}


function validate(grid, row, column, value) {
    return validateRow(grid, row, column, value)
        && validateColumn(grid, row, column, value)
        && validateBox(grid, row, column, value);
}

function validateRow(grid, row, column, value) {
   
    for (let i = 0; i < GRID_SIZE; i++) {
        if (grid[row][i] === value && column !== i) return false;
    }

    return true;
}

function validateColumn(grid, row, column, value) {

    for (let i = 0; i < GRID_SIZE; i++) {
        if (grid[i][column] === value && row !== i) return false;
    }

    return true;
}

function validateBox(grid, row, column, value) {
    const firstRowInBox = row - row % BOX_SIZE;
    const firstColumnInBox = column - column % BOX_SIZE;

    for (let i = firstRowInBox; i < firstRowInBox + BOX_SIZE; i++) {
        for (let j = firstColumnInBox; j < firstColumnInBox + BOX_SIZE; j++) {
            if (grid[i][j] === value && i !== row && j != column) return false;
        }
    }
    return true;
}

function removeCells(grid) {
    
    const LEVEL = 30;
    const resultGrid = [...grid].map(row => [...row]);

    let i = 0;

    while (i < LEVEL) {
       
        const row = Math.floor(Math.random() * GRID_SIZE);
        const column = Math.floor(Math.random() * GRID_SIZE);

        if (resultGrid[row][column] !== null)  {
            resultGrid[row][column] = null;
            i++;
        }
    }

    return resultGrid;
}