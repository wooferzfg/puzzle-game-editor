import { ReactNode } from 'react';
import { Menu, Item, Separator } from 'react-contexify';
import { CellContextMenuProps, ContextMenuItemClickProps } from './types';

export function CellContextMenu({ menuId, objects, hideAll }: CellContextMenuProps) {
  const menuItems: ReactNode[] = [];

  objects.forEach((gridObject, index) => {
    if (index !== 0) {
      menuItems.push(<Separator key={index} />);
    }
    menuItems.push(
      <Item
        key={gridObject.type}
        onClick={({ props }: { props?: ContextMenuItemClickProps }) => {
          const { coordinate: { row, column }, onRemoveObject } = props!;
          onRemoveObject({ row, column }, gridObject.type);
          hideAll();
        }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        Remove {gridObject.type}
      </Item>
    );
  });

  return (
    <Menu id={menuId}>
      {menuItems}
    </Menu>
  );
};