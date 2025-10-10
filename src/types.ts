import _ from 'lodash';
import { ReactNode } from "react";

export type CellType = 'Wall' | 'Floor' | 'Void' | 'Water';
export const cellTypes: CellType[] = ['Wall', 'Floor', 'Void', 'Water'];

export type ObjectType = 'Conveyor' | 'Box' | 'Player' | 'Player Two' | 'Door' | 'Button' | 'Platform' | 'Arrow Block' | 'Arrow Button' | 'And Wire' | 'Or Wire' | 'Not Wire' | 'Emitter' | 'Reflector' | 'Receiver' | 'Goal' | 'Barrier' | 'Countdown' | 'Creature' | 'Exit';
export const objectTypes: ObjectType[] = ['Conveyor', 'Box', 'Door', 'Button', 'Platform', 'Arrow Block', 'Arrow Button', 'And Wire', 'Or Wire', 'Not Wire', 'Emitter', 'Reflector', 'Receiver', 'Goal', 'Barrier', 'Countdown', 'Creature', 'Exit', 'Player', 'Player Two'];
export const switchTypes: ObjectType[] = ['Button', 'Arrow Button', 'Receiver'];
export const wireTypes: ObjectType[] = ['And Wire', 'Or Wire', 'Not Wire'];
export const switchAndWireTypes: ObjectType[] = _.concat(switchTypes, wireTypes);
export const doorTypes: ObjectType[] = ['Door', 'Platform'];
export const rotatableObjectTypes: ObjectType[] = ['Conveyor', 'Arrow Block', 'Arrow Button', 'Emitter', 'Reflector', 'Exit'];
export const laserColoredObjectTypes: ObjectType[] = ['Emitter', 'Receiver'];
export const immovableObjectTypes: ObjectType[] = ['Emitter', 'Reflector'];
export type ActionType = 'Move Object';
export const actionTypes: ActionType[] = ['Move Object'];

export type CreatureType = 'Line of Sight';
export const creatureTypes: CreatureType[] = ['Line of Sight'];

export type RotationDirection = 'up' | 'right' | 'down' | 'left';
export const rotationDirections: RotationDirection[] = ['up', 'right', 'down', 'left'];

export const countdownValues = [0, 1, 2, 3, 4, 5];

export type LaserColor = 'red' | 'blue';

export interface ObjectData {
  type: ObjectType;
  id: string;
  rotationDirection?: RotationDirection;
  connectedObjectIds?: string[];
  isImmovable?: boolean;
  laserColor?: LaserColor;
  countdownValue?: number;
  creatureType?: CreatureType;
  exitLevel?: string;
  otherExitId?: string;
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
  onSetCreatureType: (coordinate: CellCoordinate, id: string, creatureType: CreatureType) => void;
  onSetImmovable: (coordinate: CellCoordinate, id: string, isImmovable: boolean) => void;
  onSetLaserColor: (coordinate: CellCoordinate, id: string, laserColor: LaserColor) => void;
  onSetCountdownValue: (coordinate: CellCoordinate, id: string, countdownValue: number) => void;
  onSetExitLevel: (coordinate: CellCoordinate, id: string, exitLevel: string) => void;
  onSetOtherExitId: (coordinate: CellCoordinate, id: string, otherExitId: string) => void;
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
  onSetCreatureType: (coordinate: CellCoordinate, id: string, creatureType: CreatureType) => void;
  onSetImmovable: (coordinate: CellCoordinate, id: string, isImmovable: boolean) => void;
  onSetLaserColor: (coordinate: CellCoordinate, id: string, laserColor: LaserColor) => void;
  onSetCountdownValue: (coordinate: CellCoordinate, id: string, countdownValue: number) => void;
  onSetExitLevel: (coordinate: CellCoordinate, id: string, exitLevel: string) => void;
  onSetOtherExitId: (coordinate: CellCoordinate, id: string, otherExitId: string) => void;
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