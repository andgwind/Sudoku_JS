import { findEmptyCell, generateSudoku } from "./sudokuGenerator.js";
import { BOX_SIZE, GRID_SIZE } from "./utilites.js";

export class Sudoku {
    
    constructor() {
        this.grid = generateSudoku();
    }

    getDuplicateCoordinates(row, column, value) {
        const duplicatesInColumn = this.getDuplicateCoordinatesInColumn(row, column, value);
        const duplicatesInRow = this.getDuplicateCoordinatesInRow(row, column, value);
        const duplicatesInBox = this.getDuplicateCoordinatesInBox(row, column, value);

        const duplicates = [...duplicatesInColumn, ...duplicatesInRow];
        duplicatesInBox.forEach( duplicateInBox => {
            if (duplicateInBox.row !== row && duplicateInBox.column !== column) duplicates.push(duplicateInBox);
        });

        return duplicates;
    }

    getDuplicateCoordinatesInColumn(row, column, value) {
        
        const duplicates = [];
        for (let r = 0; r < GRID_SIZE; r++) {

            if (this.grid[r][column] === value && r !== row) {
                duplicates.push({row: r, column});
            }
        }
        return duplicates;
    }

    getDuplicateCoordinatesInRow(row, column, value) {
        
        const duplicates = [];
        for (let col = 0; col < GRID_SIZE; col++) {

            if (this.grid[row][column] === value && col !== column) {
                duplicates.push({row, column: col});
            }
        }
        return duplicates;
    }

    getDuplicateCoordinatesInBox(row, column, value) {
        
        const duplicates = [];
        const firstRowInBox = row - row % BOX_SIZE;
        const firstColumnInBox = column - column % BOX_SIZE;

        for (let r = firstRowInBox; r < firstRowInBox + BOX_SIZE; r++) {
            for (let col = firstColumnInBox; col < firstColumnInBox + BOX_SIZE; col++) {

                if (this.grid[r][col] === value && r !== row && col != column) {
                    duplicates.push({row: r, column: col});
                }
            }
        }
        return duplicates;
    }

    hasEmptyCells() { 
        return Boolean(findEmptyCell(this.grid));
    }
}