import { GridObjectProps, ObjectType } from "./types";

import boxImage from './images/block.png';
import playerImage from './images/player.png';
import doorImage from './images/door.png';
import buttonImage from './images/button.png';
import platformImage from './images/platform.png';
import podiumImage from './images/podium.png';
import arrowBlockImage from './images/arrow_block.png';
import arrowButtonImage from './images/arrow_button.png';

export function GridObject({ gridObject }: GridObjectProps) {
  const getImageForObject = () => {
    if (gridObject === 'Box') {
      return boxImage;
    }
    if (gridObject === 'Player') {
      return playerImage;
    }
    if (gridObject === 'Door') {
      return doorImage;
    }
    if (gridObject === 'Button') {
      return buttonImage;
    }
    if (gridObject === 'Platform') {
      return platformImage;
    }
    if (gridObject === 'Podium') {
      return podiumImage;
    }
    if (gridObject === 'Arrow Block') {
      return arrowBlockImage;
    }
    if (gridObject === 'Arrow Button') {
      return arrowButtonImage;
    }
    throw new Error(`No image for grid object: ${gridObject}`);
  };

  return (
    <div className="grid-object" key={gridObject}>
      <img src={getImageForObject()} />
    </div>
  );
}
