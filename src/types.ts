import { ReactNode } from "react";

export type CellType = 'Wall' | 'Floor' | 'Void';
export const cellTypes: CellType[] = ['Wall', 'Floor', 'Void'];

export type ObjectType = 'Box' | 'Player' | 'Door' | 'Button' | 'Platform' | 'Podium' | 'Arrow Block' | 'Arrow Button' | 'And Wire' | 'Or Wire';
export const objectTypes: ObjectType[] = ['Box', 'Player', 'Door', 'Button', 'Platform', 'Podium', 'Arrow Block', 'Arrow Button', 'And Wire', 'Or Wire'];
export const switchTypes: ObjectType[] = ['Button', 'Arrow Button'];
export const wireTypes: ObjectType[] = ['And Wire', 'Or Wire'];
export const doorTypes: ObjectType[] = ['Door', 'Platform'];
export const rotatableObjectTypes: ObjectType[] = ['Arrow Block', 'Arrow Button'];

export type RotationDirection = 'up' | 'right' | 'down' | 'left';
export const rotationDirections: RotationDirection[] = ['up', 'right', 'down', 'left'];

export interface ObjectData {
  type: ObjectType;
  rotationDirection: RotationDirection;
  id: string;
  connectedObjectId: string | null;
}

export interface ObjectWithCoordinate {
  object: ObjectData;
  coordinate: CellCoordinate;
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
  isHighlighted: boolean;
  onMouseDown: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onMouseEnter: () => void;
  onRemoveObject: (coordinate: CellCoordinate, id: string) => void;
  onSetRotation: (coordinate: CellCoordinate, id: string, direction: RotationDirection) => void;
  onConnect: (coordinate: CellCoordinate, id: string, doorOrWireId: string | null) => void;
  doorsAndWires: ObjectWithCoordinate[];
}

export interface CellContextMenuProps {
  menuId: string;
  objects: ObjectData[];
  hideAll: () => void;
  doorsAndWires: ObjectWithCoordinate[];
}

export interface ContextMenuItemClickProps {
  coordinate: CellCoordinate;
  onRemoveObject: (coordinate: CellCoordinate, id: string) => void;
  onSetRotation: (coordinate: CellCoordinate, id: string, direction: RotationDirection) => void;
  onConnect: (coordinate: CellCoordinate, id: string, doorOrWireId: string | null) => void;
}

export interface GridObjectProps {
  objectData: ObjectData;
}

export interface TooltipProps {
  children: ReactNode;
  tooltipContent: ReactNode;
}