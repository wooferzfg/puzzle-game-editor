import React from 'react';
import { useContextMenu } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import { CellContextMenu } from './CellContextMenu';
import { ContextMenuItemClickProps, CellProps, CellType } from './types';
import { GridObject } from './GridObject';

export function Cell({
  coordinate: { row, column },
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

    const props: ContextMenuItemClickProps = {
      coordinate: { row, column },
      onRemoveObject,
    };
    show({
      event,
      props,
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
      {objects.map((objectData) => (
        <GridObject key={objectData.type} objectData={objectData} />
      ))}
      <CellContextMenu menuId={menuId} objects={objects} hideAll={hideAll} />
    </div>
  );
}