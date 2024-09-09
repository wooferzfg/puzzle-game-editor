import React, { ReactNode, useState } from 'react';
import _ from 'lodash';
import { Menu, Item, Separator, useContextMenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';

type CellType = 'Wall' | 'Floor' | 'Void';
type ObjectType = 'Box' | 'Player';

interface CellProps {
  row: number;
  column: number;
  cellType: CellType;
  objects: ObjectType[];
  onMouseDown: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onMouseEnter: () => void;
  onRemoveObject: (row: number, column: number, object: ObjectType) => void;
}

interface CellContextMenuProps {
  menuId: string;
  objects: ObjectType[];
  hideAll: () => void;
}

interface ContextMenuItemClickProps {
  row: number;
  column: number;
  onRemoveObject: (row: number, column: number, object: ObjectType) => void;
}

function Cell({
  row,
  column,
  cellType,
  objects,
  onMouseDown,
  onMouseEnter,
  onRemoveObject,
}: CellProps) {
  const menuId = `${row}-${column}`;
  const { show, hideAll } = useContextMenu({ id: menuId });

  const handleContextMenu = (event: React.MouseEvent) => {
    if (objects.length === 0) {
      return;
    }
    event.preventDefault();
    show({
      event,
      props: {
        row,
        column,
        onRemoveObject,
      },
    });
  };

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
    <div
      key={`${row}-${column}`}
      className="grid-item"
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onContextMenu={handleContextMenu}
      style={{ backgroundColor: getColor(cellType) }}
    >
      {objects.map((gridObject) => (
        <div className="grid-object" key={gridObject}>
          {gridObject === 'Box' ? 'B' : 'P'}
        </div>
      ))}
      <CellContextMenu menuId={menuId} objects={objects} hideAll={hideAll} />
    </div>
  );
}

const CellContextMenu = ({ menuId, objects, hideAll }: CellContextMenuProps) => {
  const menuItems: ReactNode[] = [];

  objects.forEach((gridObject, index) => {
    if (index !== 0) {
      menuItems.push(<Separator key={index} />);
    }
    menuItems.push(
      <Item
        key={gridObject}
        onClick={({ props }: { props?: ContextMenuItemClickProps }) => {
          const { row, column, onRemoveObject } = props!;
          onRemoveObject(row, column, gridObject);
          hideAll();
        }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        Remove {gridObject}
      </Item>
    );
  });

  return (
    <Menu id={menuId}>
      {menuItems}
    </Menu>
  );
};

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
