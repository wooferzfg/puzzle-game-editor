import { GridObjectProps } from "./types";

import boxImage from './images/block.png';
import playerImage from './images/player.png';
import doorImage from './images/door.png';
import buttonImage from './images/button.png';
import platformImage from './images/platform.png';
import podiumImage from './images/podium.png';
import arrowBlockImage from './images/arrow_block.png';
import arrowButtonImage from './images/arrow_button.png';

export function GridObject({ objectData }: GridObjectProps) {
  const { type, rotationDirection } = objectData;

  const getImageForObject = () => {
    if (type === 'Box') {
      return boxImage;
    }
    if (type === 'Player') {
      return playerImage;
    }
    if (type === 'Door') {
      return doorImage;
    }
    if (type === 'Button') {
      return buttonImage;
    }
    if (type === 'Platform') {
      return platformImage;
    }
    if (type === 'Podium') {
      return podiumImage;
    }
    if (type === 'Arrow Block') {
      return arrowBlockImage;
    }
    if (type === 'Arrow Button') {
      return arrowButtonImage;
    }
    throw new Error(`No image for grid object: ${type}`);
  };

  return (
    <div className={`grid-object ${rotationDirection}`} key={type}>
      <img alt={type} src={getImageForObject()} />
    </div>
  );
}
