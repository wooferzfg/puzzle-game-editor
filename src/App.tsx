import React, { useMemo, useState } from 'react';
import _ from 'lodash';
import 'react-contexify/dist/ReactContexify.css';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Cell } from './Cell';
import { CellCoordinate, CellState, CellType, cellTypes, doorTypes, GridState, ObjectData, ObjectType, objectTypes, ObjectWithCoordinate, RotationDirection, wireTypes } from './types';
import { exportFile, loadFile } from './Storage';

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
  const [highlightedCells, setHighlightedCells] = useState<CellCoordinate[]>([]);

  const cleanConnections = (newGrid: GridState) => {
    const gridObjects = getGridObjects(newGrid);

    for (let row = 0; row < newGrid.length; row += 1) {
      for (let column = 0; column < newGrid[row].length; column += 1) {
        newGrid[row][column].objects.forEach((object) => {
          if (!object.connectedObjectId) {
            return;
          }
          const connectedObject = gridObjects[object.connectedObjectId];
          if (!connectedObject) {
            object.connectedObjectId = null;
          }
        });
      }
    }
  }

  const updateGrid = (newGrid: GridState) => {
    cleanConnections(newGrid);
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
    if (cellTypes.includes(selectedButton as CellType)) {
      newGrid[row][column].cellType = selectedButton as CellType;
    } else {
      const objectType = selectedButton as ObjectType;
      newGrid[row][column].objects.push({
        type: objectType,
        rotationDirection: 'up',
        id: generateId(objectType),
        connectedObjectId: null,
      });
    }
    updateGrid(newGrid);
  };

  const idAlreadyExists = (objectId: string) => {
    for (let row = 0; row < grid.length; row += 1) {
      for (let column = 0; column < grid[row].length; column += 1) {
        if (grid[row][column].objects.some((object) => object.id === objectId)) {
          return true;
        }
      }
    }
    return false;
  }

  const generateId = (objectType: ObjectType) => {
    const objectName = _.kebabCase(objectType);
    for (let i = 1; ; i += 1) {
      const objectId = `${objectName}-${i}`;
      if (!idAlreadyExists(objectId)) {
        return objectId;
      }
    }
  };

  const updateHighlightedCells = (row: number, column: number) => {
    const newHighlightedCells: CellCoordinate[] = [];
    grid[row][column].objects.forEach((gridObject) => {
      if (gridObject.connectedObjectId) {
        const connectedObject = doorAndWireObjects.find((doorOrWire) => doorOrWire.object.id === gridObject.connectedObjectId);
        newHighlightedCells.push(connectedObject!.coordinate);
      }

      _.values(allObjects).forEach((otherObject) => {
        if (otherObject.object.connectedObjectId === gridObject.id) {
          newHighlightedCells.push(otherObject.coordinate);
        }
      })
    });
    setHighlightedCells(newHighlightedCells);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, row: number, column: number) => {
    if (event.button === 0) { // Left mouse button
      setMouseDownOnCell({ row, column });
      handleCellUpdate(row, column);
    }
  };

  const handleMouseEnter = (row: number, column: number) => {
    if (mouseDownOnCell && (mouseDownOnCell.row !== row || mouseDownOnCell.column !== column)) {
      setMouseDownOnCell({ row, column });
      handleCellUpdate(row, column);
    }
    updateHighlightedCells(row, column);
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

  const handleConnect = ({ row, column }: CellCoordinate, idToUpdate: string, otherObjectId: string | null) => {
    const newGrid = _.cloneDeep(grid);
    const cell = newGrid[row][column];

    const objectToUpdate = cell.objects.find((cellObject) => cellObject.id === idToUpdate);

    if (otherObjectId) {
      const allObjects = getGridObjects(newGrid);
      const otherObject = allObjects[otherObjectId];

      if (doorTypes.includes(otherObject!.object.type)) {
        _.values(allObjects).forEach((object) => {
          if (object.object.connectedObjectId === otherObjectId) {
            object.object.connectedObjectId = null;
          }
        })
      }
    }

    objectToUpdate!.connectedObjectId = otherObjectId;

    updateGrid(newGrid);
  };

  const notifyCopy = (result: boolean) => {
    if (result) {
      toast.success('Copied to clipboard');
    } else {
      toast.error('Could not copy to clipboard');
    }
  }

  const loadLevelFromFile = async () => {
    const levelJson = await loadFile();
    const levelParsed = JSON.parse(levelJson);
    setGrid(levelParsed);
    setGridStack([]);
    toast.success('Loaded level from JSON');
  };

  const allButtons: (CellType | ObjectType)[] = _.concat(cellTypes, objectTypes);

  const getGridObjects = (currentGrid: GridState) => {
    const objects: { [key: string]: ObjectWithCoordinate } = {};
    for (let row = 0; row < currentGrid.length; row += 1) {
      for (let column = 0; column < currentGrid[row].length; column += 1) {
        currentGrid[row][column].objects.forEach((object) => {
          objects[object.id] = { object, coordinate: { row, column } };
        });
      }
    }
    return objects;
  };
  const allObjects: { [key: string]: ObjectWithCoordinate } = getGridObjects(grid);
  const doorAndWireObjects: ObjectWithCoordinate[] = _.filter(allObjects, (object) => doorTypes.includes(object.object.type) || wireTypes.includes(object.object.type));

  const stringGridState = useMemo(() => JSON.stringify(grid), [grid]);

  return (
    <div className="main-container" onMouseUp={handleMouseUp}>
      <ToastContainer />
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
            <button disabled={_.isEmpty(gridStack)} onClick={undoLastMove}>Undo</button>
          </div>
          <div className="config-buttons-row">
            <CopyToClipboard text={stringGridState} onCopy={(text, result) => notifyCopy(result)}>
              <button>Save to Clipboard</button>
            </CopyToClipboard>
          </div>
          <div className="config-buttons-row">
            <button onClick={() => exportFile(stringGridState, 'level.json')}>Save to File</button>
          </div>
          <div className="config-buttons-row">
            <button onClick={loadLevelFromFile}>Load from File</button>
          </div>
        </div>
      </div>
      <div className="grid">
        {_.map(_.range(grid.length), (row) => (
          <div className="grid-row" key={row}>
            {_.map(_.range(grid[row].length), (column) => (
              <Cell
                key={`${row}-${column}`}
                coordinate={{ row, column }}
                cellType={grid[row][column].cellType}
                isHighlighted={highlightedCells.some(
                  ({ row: highlightedRow, column: highlightedColumn }) => highlightedRow === row && highlightedColumn === column
                )}
                objects={grid[row][column].objects}
                onMouseDown={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => handleMouseDown(event, row, column)}
                onMouseEnter={() => handleMouseEnter(row, column)}
                onRemoveObject={handleRemoveObject}
                onSetRotation={handleSetRotation}
                onConnect={handleConnect}
                doorsAndWires={doorAndWireObjects}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
