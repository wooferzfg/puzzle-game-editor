import _ from 'lodash';
import { ReactNode } from 'react';
import { Menu, Item, Separator, Submenu } from 'react-contexify';
import { CellContextMenuProps, ContextMenuItemClickProps, rotatableObjectTypes, RotationDirection, switchTypes, wireTypes } from './types';

export function CellContextMenu({ menuId, objects, hideAll, doorsAndWires }: CellContextMenuProps) {
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
          onRemoveObject({ row, column }, gridObject.id);
          hideAll();
        }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        Remove {gridObject.type}
      </Item>
    );

    if (rotatableObjectTypes.includes(gridObject.type)) {
      const rotationDirections: RotationDirection[] = ['up', 'right', 'down', 'left'];

      rotationDirections.forEach((direction) => {
        menuItems.push(
          <Item
            key={gridObject.type}
            onClick={({ props }: { props?: ContextMenuItemClickProps }) => {
              const { coordinate: { row, column }, onSetRotation } = props!;
              onSetRotation({ row, column }, gridObject.id, direction);
              hideAll();
            }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            {gridObject.type} rotation: {direction}
          </Item>
        );
      })
    }

    if (switchTypes.includes(gridObject.type) || wireTypes.includes(gridObject.type)) {
      const subMenuItems: ReactNode[] = [];

      doorsAndWires.forEach((doorOrWire) => {
        if (doorOrWire.object.id === gridObject.id || doorOrWire.object.connectedObjectId === gridObject.id) {
          return;
        }

        subMenuItems.push(
          <Item
            key={gridObject.type}
            onClick={({ props }: { props?: ContextMenuItemClickProps }) => {
              const { coordinate: { row, column }, onConnect } = props!;
              onConnect({ row, column }, gridObject.id, doorOrWire.object.id);
              hideAll();
            }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            {doorOrWire.object.id}
          </Item>
        );
      });

      if (!_.isEmpty(subMenuItems)) {
        menuItems.push(
          <Submenu label={`${gridObject.type}: Connect to...`}>
            {subMenuItems}
          </Submenu>
        );
      }

      if (gridObject.connectedObjectId) {
        menuItems.push(
          <Item
            key={gridObject.type}
            onClick={({ props }: { props?: ContextMenuItemClickProps }) => {
              const { coordinate: { row, column }, onConnect } = props!;
              onConnect({ row, column }, gridObject.id, null);
              hideAll();
            }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            {gridObject.type}: Disconnect
          </Item>
        );
      }
    }
  });

  return (
    <Menu id={menuId}>
      {menuItems}
    </Menu>
  );
};