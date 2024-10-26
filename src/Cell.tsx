import React from 'react';
import { useContextMenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import { CellContextMenu } from './CellContextMenu';
import { CellProps, CellType } from './types';

export function Cell({
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