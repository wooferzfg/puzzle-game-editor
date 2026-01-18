import _ from 'lodash';
import { ReactNode } from 'react';
import { Menu, Item, Separator, Submenu } from 'react-contexify';
import { CellContextMenuProps, ContextMenuItemClickProps, immovableObjectTypes, laserColoredObjectTypes, rotatableObjectTypes, switchAndWireTypes, rotationDirections, creatureTypes, countdownValues } from './types';

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

    if (gridObject.type === 'Creature') {
      creatureTypes.forEach((creatureType) => {
        menuItems.push(
          <Item
            key={gridObject.type}
            onClick={({ props }: { props?: ContextMenuItemClickProps }) => {
              const { coordinate: { row, column }, onSetCreatureType } = props!;
              onSetCreatureType({ row, column }, gridObject.id, creatureType);
              hideAll();
            }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            Creature type: {creatureType}
          </Item>
        );
      })
    }

    if (gridObject.type === 'Exit') {
      menuItems.push(
        <Item
          key={gridObject.type}
          onClick={({ props }: { props?: ContextMenuItemClickProps }) => {
            const { coordinate: { row, column }, onSetExitLevel } = props!;
            const updatedExitLevel = prompt('Enter exit level:');
            if (updatedExitLevel === null) {
              return;
            }
            onSetExitLevel({ row, column }, gridObject.id, updatedExitLevel);
            hideAll();
          }}
          onMouseDown={(event) => event.stopPropagation()}
        >
          Change Exit Level
        </Item>
      );

      menuItems.push(
        <Item
          key={gridObject.type}
          onClick={({ props }: { props?: ContextMenuItemClickProps }) => {
            const { coordinate: { row, column }, onSetOtherExitId } = props!;
            const updatedOtherExitId = prompt('Enter other exit ID:');
            if (updatedOtherExitId === null) {
              return;
            }
            onSetOtherExitId({ row, column }, gridObject.id, updatedOtherExitId);
            hideAll();
          }}
          onMouseDown={(event) => event.stopPropagation()}
        >
          Change Other Exit ID
        </Item>
      );

      menuItems.push(
        <Item
          key={gridObject.type}
          onClick={({ props }: { props?: ContextMenuItemClickProps }) => {
            const { coordinate: { row, column }, onSetExitType } = props!;
            onSetExitType({ row, column }, gridObject.id, gridObject.exitType === 'separate' ? 'together' : 'separate');
            hideAll();
          }}
          onMouseDown={(event) => event.stopPropagation()}
        >
          {gridObject.type}: {gridObject.exitType === 'separate' ? 'change to together' : 'change to separate'}
        </Item>
      );
    }

    if (immovableObjectTypes.includes(gridObject.type)) {
      menuItems.push(
        <Item
          key={gridObject.type}
          onClick={({ props }: { props?: ContextMenuItemClickProps }) => {
            const { coordinate: { row, column }, onSetImmovable } = props!;
            onSetImmovable({ row, column }, gridObject.id, !gridObject.isImmovable);
            hideAll();
          }}
          onMouseDown={(event) => event.stopPropagation()}
        >
          {gridObject.type}: {gridObject.isImmovable ? 'change to movable' : 'change to immovable'}
        </Item>
      );
    }

    if (gridObject.type === 'Bucket') {
      menuItems.push(
        <Item
          key={gridObject.type}
          onClick={({ props }: { props?: ContextMenuItemClickProps }) => {
            const { coordinate: { row, column }, onSetIsBucketFull } = props!;
            onSetIsBucketFull({ row, column }, gridObject.id, !gridObject.isBucketFull);
            hideAll();
          }}
          onMouseDown={(event) => event.stopPropagation()}
        >
          {gridObject.type}: {gridObject.isBucketFull ? 'change to empty' : 'change to full'}
        </Item>
      );
    }

    if (laserColoredObjectTypes.includes(gridObject.type)) {
      const newLaserColor = gridObject.laserColor === 'red' ? 'blue' : 'red';
      menuItems.push(
        <Item
          key={gridObject.type}
          onClick={({ props }: { props?: ContextMenuItemClickProps }) => {
            const { coordinate: { row, column }, onSetLaserColor } = props!;
            onSetLaserColor({ row, column }, gridObject.id, newLaserColor);
            hideAll();
          }}
          onMouseDown={(event) => event.stopPropagation()}
        >
          {gridObject.type} laser color: {newLaserColor}
        </Item>
      );
    }

    if (gridObject.type === 'Countdown') {
      countdownValues.forEach((countdownValue) => {
        menuItems.push(
          <Item
            key={gridObject.type}
            onClick={({ props }: { props?: ContextMenuItemClickProps }) => {
              const { coordinate: { row, column }, onSetCountdownValue } = props!;
              onSetCountdownValue({ row, column }, gridObject.id, countdownValue);
              hideAll();
            }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            Countdown value: {countdownValue}
          </Item>
        );
      });
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