import React, { useMemo, useState } from 'react';
import _ from 'lodash';
import 'react-contexify/dist/ReactContexify.css';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Cell } from './Cell';
import { CellCoordinate, CellState, CellType, cellTypes, diagonalObjectTypes, immovableObjectTypes, doorTypes, GridState, LaserColor, laserColoredObjectTypes, ObjectData, ObjectType, objectTypes, ObjectWithCoordinate, rotatableObjectTypes, RotationDirection, switchAndWireTypes, wireTypes } from './types';
import { exportFile, loadFile } from './Storage';

function App() {
  const [selectedButton, setSelectedButton] = useState<CellType | ObjectType>(
    'Void',
  );
  const [gridStack, setGridStack] = useState<GridState[]>([]);
  const [grid, setGrid] = useState<GridState>(
    _.map(_.range(20), () =>
      _.map(_.range(20), () => ({
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
          if (_.isNil(object.connectedObjectIds)) {
            return;
          }
          object.connectedObjectIds = _.filter(object.connectedObjectIds, (objectId) => (
            !_.isNil(gridObjects[objectId])
          ));
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
        rotationDirection: rotatableObjectTypes.includes(objectType) ? 'up' : undefined,
        isToggle: doorTypes.includes(objectType) ? false : undefined,
        id: generateId(objectType),
        connectedObjectIds: switchAndWireTypes.includes(objectType) ? [] : undefined,
        isDiagonal: diagonalObjectTypes.includes(objectType) ? false : undefined,
        isImmovable: immovableObjectTypes.includes(objectType) ? false : undefined,
        laserColor: laserColoredObjectTypes.includes(objectType) ? 'red' : undefined,
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
      if (!_.isNil(gridObject.connectedObjectIds)) {
        const connectedObjects: ObjectWithCoordinate[] = _.filter(
          doorAndWireObjects,
          (doorOrWire) => gridObject.connectedObjectIds?.includes(doorOrWire.object.id) ?? false,
        );
        const coordinates = _.map(connectedObjects, (connectedObject) => connectedObject.coordinate);
        newHighlightedCells.push(...coordinates);
      }

      _.values(allObjects).forEach((otherObject) => {
        if (otherObject.object.connectedObjectIds?.includes(gridObject.id)) {
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

  const handleSetToggle = ({ row, column }: CellCoordinate, idToUpdate: string, isToggle: boolean) => {
    const newGrid = _.cloneDeep(grid);
    const cell = newGrid[row][column];

    const objectToUpdate = cell.objects.find((cellObject) => cellObject.id === idToUpdate);
    objectToUpdate!.isToggle = isToggle;

    updateGrid(newGrid);
  };

  const handleSetDiagonal = ({ row, column }: CellCoordinate, idToUpdate: string, isDiagonal: boolean) => {
    const newGrid = _.cloneDeep(grid);
    const cell = newGrid[row][column];

    const objectToUpdate = cell.objects.find((cellObject) => cellObject.id === idToUpdate);
    objectToUpdate!.isDiagonal = isDiagonal;

    updateGrid(newGrid);
  };

  const handleSetImmovable = ({ row, column }: CellCoordinate, idToUpdate: string, isImmovable: boolean) => {
    const newGrid = _.cloneDeep(grid);
    const cell = newGrid[row][column];

    const objectToUpdate = cell.objects.find((cellObject) => cellObject.id === idToUpdate);
    objectToUpdate!.isImmovable = isImmovable;

    updateGrid(newGrid);
  };

  const handleSetLaserColor = ({ row, column }: CellCoordinate, idToUpdate: string, laserColor: LaserColor) => {
    const newGrid = _.cloneDeep(grid);
    const cell = newGrid[row][column];

    const objectToUpdate = cell.objects.find((cellObject) => cellObject.id === idToUpdate);
    objectToUpdate!.laserColor = laserColor;

    updateGrid(newGrid);
  };

  const handleConnect = ({ row, column }: CellCoordinate, idToUpdate: string, otherObjectId: string) => {
    const newGrid = _.cloneDeep(grid);
    const cell = newGrid[row][column];

    const objectToUpdate = cell.objects.find((cellObject) => cellObject.id === idToUpdate);

    const allObjects = getGridObjects(newGrid);
    const otherObject = allObjects[otherObjectId];

    if (doorTypes.includes(otherObject!.object.type)) {
      _.values(allObjects).forEach((object) => {
        if (_.isNil(object.object.connectedObjectIds)) {
          return;
        }
        object.object.connectedObjectIds = _.without(object.object.connectedObjectIds, otherObjectId);
      })
    }

    objectToUpdate!.connectedObjectIds!.push(otherObjectId);

    updateGrid(newGrid);
  };

  const handleDisconnect = ({ row, column }: CellCoordinate, idToUpdate: string, otherObjectId: string) => {
    const newGrid = _.cloneDeep(grid);
    const cell = newGrid[row][column];

    const objectToUpdate = cell.objects.find((cellObject) => cellObject.id === idToUpdate);
    objectToUpdate!.connectedObjectIds = _.without(objectToUpdate!.connectedObjectIds, otherObjectId);

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
        {_.chunk(allButtons, 2).map((buttonsChunk, index) => (
          <div className="sidebar-row" key={index}>
            {buttonsChunk.map((button) => (
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
          </div>
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
                onSetToggle={handleSetToggle}
                onSetDiagonal={handleSetDiagonal}
                onSetImmovable={handleSetImmovable}
                onSetLaserColor={handleSetLaserColor}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
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
