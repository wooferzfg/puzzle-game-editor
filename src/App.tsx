import React, { useState } from 'react';
import _ from 'lodash';
import 'react-contexify/dist/ReactContexify.css';
import { Cell } from './Cell';

function App() {
  const [selectedButton, setSelectedButton] = useState<CellType | ObjectType>(
    'Void',
  );
  const [grid, setGrid] = useState(
    _.map(_.range(30), () =>
      _.map(_.range(30), () => ({
        cellType: 'Void' as CellType,
        objects: [] as ObjectType[],
      })),
    ),
  );
  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleCellUpdate = (row: number, column: number) => {
    setGrid((prevGrid) => {
      const newGrid = _.cloneDeep(prevGrid);
      if (
        selectedButton === 'Wall' ||
        selectedButton === 'Floor' ||
        selectedButton === 'Void'
      ) {
        newGrid[row][column].cellType = selectedButton;
      } else if (!newGrid[row][column].objects.includes(selectedButton as ObjectType)) {
        newGrid[row][column].objects.push(selectedButton as ObjectType);
      }
      return newGrid;
    });
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, row: number, column: number) => {
    if (event.button === 0) { // Left mouse button
      setIsMouseDown(true);
      handleCellUpdate(row, column);
    }
  };

  const handleMouseEnter = (row: number, column: number) => {
    if (isMouseDown) {
      handleCellUpdate(row, column);
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const addRow = (position: 'top' | 'bottom') => {
    const newRow: { cellType: CellType; objects: ObjectType[] }[] = Array.from(
      { length: grid[0].length },
      () => ({ cellType: 'Void', objects: [] })
    );
    if (position === 'top') {
      setGrid([newRow, ...grid]);
    } else {
      setGrid([...grid, newRow]);
    }
  };

  const removeRow = (position: 'top' | 'bottom') => {
    if (grid.length > 1) {
      if (position === 'top') {
        setGrid(grid.slice(1));
      } else {
        setGrid(grid.slice(0, -1));
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
    setGrid(newGrid);
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
      setGrid(newGrid);
    }
  };

  const handleRemoveObject = (row: number, column: number, object: ObjectType) => {
    setGrid((prevGrid) => {
      const newGrid = _.cloneDeep(prevGrid);
      const cell = newGrid[row][column];
      cell.objects = cell.objects.filter((obj) => obj !== object);
      return newGrid;
    });
  };

  return (
    <div style={{ display: 'flex' }} onMouseUp={handleMouseUp}>
      <div className="sidebar">
        {['Wall', 'Floor', 'Void', 'Box', 'Player'].map((button) => (
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
        <div className="resize-buttons">
          <div className="resize-buttons-row">
            <button onClick={() => addRow('top')}>+ Top</button>
            <button onClick={() => removeRow('top')}>- Top</button>
          </div>
          <div className="resize-buttons-row">
            <button onClick={() => addRow('bottom')}>+ Bottom</button>
            <button onClick={() => removeRow('bottom')}>- Bottom</button>
          </div>
          <div className="resize-buttons-row">
            <button onClick={() => addColumn('left')}>+ Left</button>
            <button onClick={() => removeColumn('left')}>- Left</button>
          </div>
          <div className="resize-buttons-row">
            <button onClick={() => addColumn('right')}>+ Right</button>
            <button onClick={() => removeColumn('right')}>- Right</button>
          </div>
        </div>
      </div>
      <div className="grid">
        {_.map(_.range(grid.length), (row) => (
          <div className="grid-row" key={row}>
            {_.map(_.range(grid[0].length), (column) => (
              <Cell
                key={`${row}-${column}`}
                row={row}
                column={column}
                cellType={grid[row][column].cellType}
                objects={grid[row][column].objects}
                onMouseDown={(event) => handleMouseDown(event, row, column)}
                onMouseEnter={() => handleMouseEnter(row, column)}
                onRemoveObject={handleRemoveObject}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
