import _ from 'lodash';
import { ReactNode } from "react";

export type CellType = 'Wall' | 'Floor' | 'Void';
export const cellTypes: CellType[] = ['Wall', 'Floor', 'Void'];

export type ObjectType = 'Conveyor' | 'Box' | 'Player' | 'Door' | 'Button' | 'Platform' | 'Color Switcher' | 'Arrow Block' | 'Arrow Button' | 'And Wire' | 'Or Wire' | 'Not Wire' | 'Emitter' | 'Reflector' | 'Receiver' | 'Goal';
export const objectTypes: ObjectType[] = ['Conveyor', 'Box', 'Door', 'Button', 'Platform', 'Color Switcher', 'Arrow Block', 'Arrow Button', 'And Wire', 'Or Wire', 'Not Wire', 'Emitter', 'Reflector', 'Receiver', 'Goal', 'Player'];
export const switchTypes: ObjectType[] = ['Button', 'Arrow Button'];
export const wireTypes: ObjectType[] = ['And Wire', 'Or Wire', 'Not Wire'];
export const switchAndWireTypes: ObjectType[] = _.concat(switchTypes, wireTypes);
export const doorTypes: ObjectType[] = ['Door', 'Platform'];
export const rotatableObjectTypes: ObjectType[] = ['Conveyor', 'Arrow Block', 'Arrow Button', 'Emitter', 'Reflector'];
export const laserColoredObjectTypes: ObjectType[] = ['Emitter', 'Receiver'];
export const diagonalObjectTypes: ObjectType[] = ['Emitter', 'Reflector'];
export const immovableObjectTypes: ObjectType[] = ['Emitter', 'Reflector'];

export type RotationDirection = 'up' | 'right' | 'down' | 'left';
export const rotationDirections: RotationDirection[] = ['up', 'right', 'down', 'left'];

export type LaserColor = 'red' | 'blue';

export interface ObjectData {
  type: ObjectType;
  id: string;
  rotationDirection?: RotationDirection;
  connectedObjectIds?: string[];
  isToggle?: boolean;
  isDiagonal?: boolean;
  isImmovable?: boolean;
  laserColor?: LaserColor;
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
  onSetToggle: (coordinate: CellCoordinate, id: string, isToggle: boolean) => void;
  onSetDiagonal: (coordinate: CellCoordinate, id: string, isDiagonal: boolean) => void;
  onSetImmovable: (coordinate: CellCoordinate, id: string, isImmovable: boolean) => void;
  onSetLaserColor: (coordinate: CellCoordinate, id: string, laserColor: LaserColor) => void;
  onConnect: (coordinate: CellCoordinate, id: string, doorOrWireId: string) => void;
  onDisconnect: (coordinate: CellCoordinate, id: string, doorOrWireId: string) => void;
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
  onSetToggle: (coordinate: CellCoordinate, id: string, isToggle: boolean) => void;
  onSetDiagonal: (coordinate: CellCoordinate, id: string, isDiagonal: boolean) => void;
  onSetImmovable: (coordinate: CellCoordinate, id: string, isImmovable: boolean) => void;
  onSetLaserColor: (coordinate: CellCoordinate, id: string, laserColor: LaserColor) => void;
  onConnect: (coordinate: CellCoordinate, id: string, doorOrWireId: string) => void;
  onDisconnect: (coordinate: CellCoordinate, id: string, doorOrWireId: string) => void;
}

export interface GridObjectProps {
  objectData: ObjectData;
}

export interface TooltipProps {
  children: ReactNode;
  tooltipContent: ReactNode;
}