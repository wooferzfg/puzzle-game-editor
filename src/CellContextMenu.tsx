import { ReactNode } from 'react';
import { Menu, Item, Separator } from 'react-contexify';

export function CellContextMenu({ menuId, objects, hideAll }: CellContextMenuProps) {
  const menuItems: ReactNode[] = [];

  objects.forEach((gridObject, index) => {
    if (index !== 0) {
      menuItems.push(<Separator key={index} />);
    }
    menuItems.push(
      <Item
        key={gridObject}
        onClick={({ props }: { props?: ContextMenuItemClickProps }) => {
          const { row, column, onRemoveObject } = props!;
          onRemoveObject(row, column, gridObject);
          hideAll();
        }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        Remove {gridObject}
      </Item>
    );
  });

  return (
    <Menu id={menuId}>
      {menuItems}
    </Menu>
  );
};