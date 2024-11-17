import React, { useState } from 'react';
import _ from 'lodash';
import 'react-contexify/dist/ReactContexify.css';
import { Cell } from './Cell';
import { CellCoordinate, CellState, CellType, GridState, ObjectData, ObjectType, RotationDirection } from './types';

function App() {
  const [selectedButton, setSelectedButton] = useState<CellType | ObjectType>(
    'Void',
  );
  const [gridStack, setGridStack] = useState<GridState[]>([]);
  const [grid, setGrid] = useState<GridState>(
    _.map(_.range(30), () =>
      _.map(_.range(30), () => ({
        cellType: 'Void' as CellType,
        objects: [] as ObjectData[],
      })),
    ),
  );
  const [mouseDownOnCell, setMouseDownOnCell] = useState<CellCoordinate | null>(null);

  const updateGrid = (newGrid: GridState) => {
    setGridStack((prevGridStack) => {
      const newGridStack = _.clone(prevGridStack);
      newGridStack.push(grid);
      return newGridStack;
    });
    setGrid(newGrid);
  };

  const undoLastMove = () => {
    if (_.isEmpty(gridStack)) {
      return;
    }
    const prevGrid = gridStack.pop() as GridState;
    setGrid(prevGrid);
  };

  const handleCellUpdate = (row: number, column: number) => {
    const existingObject = grid[row][column].objects.find((gridObject) => gridObject.type === selectedButton)
    if (existingObject) {
      handleRemoveObject({ row, column }, existingObject.id);
      return;
    }

    const newGrid = _.cloneDeep(grid);
    if (
      selectedButton === 'Wall' ||
      selectedButton === 'Floor' ||
      selectedButton === 'Void'
    ) {
      newGrid[row][column].cellType = selectedButton;
    } else {
      newGrid[row][column].objects.push({
        type: selectedButton as ObjectType,
        rotationDirection: 'up',
        id: _.uniqueId(`${_.kebabCase(selectedButton)}-`),
      });
    }
    updateGrid(newGrid);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, row: number, column: number) => {
    if (event.button === 0) { // Left mouse button
      setMouseDownOnCell({ row, column });
      handleCellUpdate(row, column);
    }
  };

  const handleMouseEnter = (row: number, column: number) => {
    if (mouseDownOnCell && (mouseDownOnCell.row !== row || mouseDownOnCell.column !== column)) {
      handleCellUpdate(row, column);
    }
  };

  const handleMouseUp = () => {
    setMouseDownOnCell(null);
  };

  const addRow = (position: 'top' | 'bottom') => {
    const newRow: CellState[] = Array.from(
      { length: grid[0].length },
      () => ({ cellType: 'Void', objects: [] })
    );
    if (position === 'top') {
      updateGrid([newRow, ...grid]);
    } else {
      updateGrid([...grid, newRow]);
    }
  };

  const removeRow = (position: 'top' | 'bottom') => {
    if (grid.length > 1) {
      if (position === 'top') {
        updateGrid(grid.slice(1));
      } else {
        updateGrid(grid.slice(0, -1));
      }
    }
  };

  const addColumn = (position: 'left' | 'right') => {
    const newGrid = grid.map(row => {
      const newRow = [...row];
      if (position === 'left') {
        newRow.unshift({ cellType: 'Void', objects: [] });
      } else {
        newRow.push({ cellType: 'Void', objects: [] });
      }
      return newRow;
    });
    updateGrid(newGrid);
  };

  const removeColumn = (position: 'left' | 'right') => {
    if (grid[0].length > 1) {
      const newGrid = grid.map(row => {
        const newRow = [...row];
        if (position === 'left') {
          newRow.shift();
        } else {
          newRow.pop();
        }
        return newRow;
      });
      updateGrid(newGrid);
    }
  };

  const handleRemoveObject = ({ row, column }: CellCoordinate, idToRemove: string) => {
    const newGrid = _.cloneDeep(grid);
    const cell = newGrid[row][column];
    cell.objects = cell.objects.filter((cellObject) => cellObject.id !== idToRemove);
    updateGrid(newGrid);
  };

  const handleSetRotation = ({ row, column }: CellCoordinate, idToUpdate: string, direction: RotationDirection) => {
    const newGrid = _.cloneDeep(grid);
    const cell = newGrid[row][column];

    const objectToUpdate = cell.objects.find((cellObject) => cellObject.id === idToUpdate);
    objectToUpdate!.rotationDirection = direction;

    updateGrid(newGrid);
  };

  const allButtons: (CellType | ObjectType)[] = [
    'Wall',
    'Floor',
    'Void',
    'Box',
    'Player',
    'Door',
    'Button',
    'Platform',
    'Podium',
    'Arrow Block',
    'Arrow Button',
  ];

  return (
    <div className="main-container" onMouseUp={handleMouseUp}>
      <div className="sidebar">
        {allButtons.map((button) => (
          <button
            key={button}
            onClick={() => setSelectedButton(button as CellType | ObjectType)}
            style={{
              backgroundColor:
                selectedButton === button ? 'lightblue' : 'white',
            }}
          >
            {button}
          </button>
        ))}
        <div className="config-buttons">
          <div className="config-buttons-row">
            <button onClick={() => addRow('top')}>+ Top</button>
            <button onClick={() => removeRow('top')}>- Top</button>
          </div>
          <div className="config-buttons-row">
            <button onClick={() => addRow('bottom')}>+ Bottom</button>
            <button onClick={() => removeRow('bottom')}>- Bottom</button>
          </div>
          <div className="config-buttons-row">
            <button onClick={() => addColumn('left')}>+ Left</button>
            <button onClick={() => removeColumn('left')}>- Left</button>
          </div>
          <div className="config-buttons-row">
            <button onClick={() => addColumn('right')}>+ Right</button>
            <button onClick={() => removeColumn('right')}>- Right</button>
          </div>
          <div className="config-buttons-row">
            <button disabled={_.isEmpty(gridStack)} onClick={() => undoLastMove()}>Undo</button>
          </div>
        </div>
      </div>
      <div className="grid">
        {_.map(_.range(grid.length), (row) => (
          <div className="grid-row" key={row}>
            {_.map(_.range(grid[0].length), (column) => (
              <Cell
                key={`${row}-${column}`}
                coordinate={{ row, column }}
                cellType={grid[row][column].cellType}
                objects={grid[row][column].objects}
                onMouseDown={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => handleMouseDown(event, row, column)}
                onMouseEnter={() => handleMouseEnter(row, column)}
                onRemoveObject={handleRemoveObject}
                onSetRotation={handleSetRotation}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
