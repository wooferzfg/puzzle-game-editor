export type CellType = 'Wall' | 'Floor' | 'Void';
export type ObjectType = 'Box' | 'Player' | 'Door' | 'Button' | 'Platform' | 'Podium' | 'Arrow Block' | 'Arrow Button';

export interface CellState {
  cellType: CellType,
  objects: ObjectType[],
}

export type GridState = CellState[][];

export interface CellProps {
  row: number;
  column: number;
  cellType: CellType;
  objects: ObjectType[];
  onMouseDown: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onMouseEnter: () => void;
  onRemoveObject: (row: number, column: number, object: ObjectType) => void;
}

export interface CellContextMenuProps {
  menuId: string;
  objects: ObjectType[];
  hideAll: () => void;
}

export interface ContextMenuItemClickProps {
  row: number;
  column: number;
  onRemoveObject: (row: number, column: number, object: ObjectType) => void;
}

export interface GridObjectProps {
  gridObject: ObjectType;
}