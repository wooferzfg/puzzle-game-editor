import _ from 'lodash';
import { ReactNode } from 'react';
import { Menu, Item, Separator, Submenu } from 'react-contexify';
import { CellContextMenuProps, ContextMenuItemClickProps, doorTypes, rotatableObjectTypes, RotationDirection, switchAndWireTypes } from './types';

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

    if (doorTypes.includes(gridObject.type)) {
      menuItems.push(
        <Item
          key={gridObject.type}
          onClick={({ props }: { props?: ContextMenuItemClickProps }) => {
            const { coordinate: { row, column }, onSetToggle } = props!;
            onSetToggle({ row, column }, gridObject.id, !gridObject.isToggle);
            hideAll();
          }}
          onMouseDown={(event) => event.stopPropagation()}
        >
          {gridObject.type}: {gridObject.isToggle ? 'Disable' : 'Enable'} toggle
        </Item>
      );
    }

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

    if (switchAndWireTypes.includes(gridObject.type)) {
      const connectSubMenuItems: ReactNode[] = [];

      doorsAndWires.forEach((doorOrWire) => {
        if (doorOrWire.object.id === gridObject.id || doorOrWire.object.connectedObjectIds?.includes(gridObject.id)) {
          return;
        }

        connectSubMenuItems.push(
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

      const disconnectSubMenuItems: ReactNode[] = gridObject.connectedObjectIds!.map((connectedObjectId) => (
        <Item
          key={gridObject.type}
          onClick={({ props }: { props?: ContextMenuItemClickProps }) => {
            const { coordinate: { row, column }, onDisconnect } = props!;
            onDisconnect({ row, column }, gridObject.id, connectedObjectId);
            hideAll();
          }}
          onMouseDown={(event) => event.stopPropagation()}
        >
          {connectedObjectId}
        </Item>
      ));

      if (!_.isEmpty(connectSubMenuItems)) {
        menuItems.push(
          <Submenu label={`${gridObject.type}: Connect to...`}>
            {connectSubMenuItems}
          </Submenu>
        );
      }
      if (!_.isEmpty(disconnectSubMenuItems)) {
        menuItems.push(
          <Submenu label={`${gridObject.type}: Disconnect from...`}>
            {disconnectSubMenuItems}
          </Submenu>
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