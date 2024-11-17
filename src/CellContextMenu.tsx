import { ReactNode } from 'react';
import { Menu, Item, Separator } from 'react-contexify';
import { CellContextMenuProps, ContextMenuItemClickProps, ObjectType, RotationDirection } from './types';

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

    const rotatableObjectTypes: ObjectType[] = ['Arrow Block', 'Arrow Button'];
    if (rotatableObjectTypes.includes(gridObject.type)) {
      const rotationDirections: RotationDirection[] = ['up', 'right', 'down', 'left'];

      rotationDirections.forEach((direction) => {
        menuItems.push(
          <Item
            key={gridObject.type}
            onClick={({ props }: { props?: ContextMenuItemClickProps }) => {
              const { coordinate: { row, column }, onSetRotation } = props!;
              onSetRotation({ row, column }, gridObject.type, direction);
              hideAll();
            }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            {gridObject.type} rotation: {direction}
          </Item>
        );
      })
    }
  });

  return (
    <Menu id={menuId}>
      {menuItems}
    </Menu>
  );
};