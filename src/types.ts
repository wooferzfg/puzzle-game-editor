export type CellType = 'Wall' | 'Floor' | 'Void';
export type ObjectType = 'Box' | 'Player' | 'Door' | 'Button' | 'Platform' | 'Podium' | 'Arrow Block' | 'Arrow Button';

export type RotationDirection = 'up' | 'right' | 'down' | 'left';

export interface ObjectData {
  type: ObjectType;
  rotationDirection: RotationDirection;
}

export interface CellState {
  cellType: CellType,
  objects: ObjectData[],
}

export interface CellCoordinate {
  row: number;
  column: number;
}

export type GridState = CellState[][];

export interface CellProps {
  coordinate: CellCoordinate;
  cellType: CellType;
  objects: ObjectData[];
  onMouseDown: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onMouseEnter: () => void;
  onRemoveObject: (coordinate: CellCoordinate, object: ObjectType) => void;
  onSetRotation: (coordinate: CellCoordinate, object: ObjectType, direction: RotationDirection) => void;
}

export interface CellContextMenuProps {
  menuId: string;
  objects: ObjectData[];
  hideAll: () => void;
}

export interface ContextMenuItemClickProps {
  coordinate: CellCoordinate;
  onRemoveObject: (coordinate: CellCoordinate, object: ObjectType) => void;
  onSetRotation: (coordinate: CellCoordinate, object: ObjectType, direction: RotationDirection) => void;
}

export interface GridObjectProps {
  objectData: ObjectData;
}