import React, { useState } from 'react';
import _ from 'lodash';

type CellType = 'Wall' | 'Floor' | 'Void';
type ObjectType = 'Box' | 'Player';

interface CellProps {
  row: number;
  column: number;
  cellType: CellType;
  objects: ObjectType[];
  onMouseDown: () => void;
  onMouseEnter: () => void;
}

function Cell({
  row,
  column,
  cellType,
  objects,
  onMouseDown,
  onMouseEnter,
}: CellProps) {
  const getColor = (type: CellType) => {
    switch (type) {
      case 'Wall':
        return '#808080'; // gray
      case 'Floor':
        return '#D2B48C'; // light brown
      case 'Void':
      default:
        return '#654321'; // dark brown
    }
  };

  return (
    <g onMouseDown={onMouseDown} onMouseEnter={onMouseEnter}>
      <rect
        fill={getColor(cellType)}
        stroke="red"
        strokeWidth="1"
        x={column * 30}
        y={row * 30}
        width="30"
        height="30"
      />
      {objects.map((obj, index) => (
        <text
          key={index}
          x={column * 30 + 15}
          y={row * 30 + 20}
          textAnchor="middle"
          fill="white"
        >
          {obj === 'Box' ? 'B' : 'P'}
        </text>
      ))}
    </g>
  );
}

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
      } else {
        newGrid[row][column].objects.push(selectedButton as ObjectType);
      }
      return newGrid;
    });
  };

  const handleMouseDown = (row: number, column: number) => {
    setIsMouseDown(true);
    handleCellUpdate(row, column);
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
      <svg className="grid" width="900" height="900">
        {_.map(_.range(grid.length), (row) =>
          _.map(_.range(grid[0].length), (column) => (
            <Cell
              key={`${row}-${column}`}
              row={row}
              column={column}
              cellType={grid[row][column].cellType}
              objects={grid[row][column].objects}
              onMouseDown={() => handleMouseDown(row, column)}
              onMouseEnter={() => handleMouseEnter(row, column)}
            />
          )),
        )}
      </svg>
    </div>
  );
}

export default App;
