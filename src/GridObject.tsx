import { GridObjectProps, ObjectType } from "./types";

import boxImage from './images/block.png';
import playerImage from './images/player.png';

export function GridObject({ gridObject }: GridObjectProps) {
  const getImageForObject = () => {
    if (gridObject === 'Box') {
      return boxImage;
    }
    if (gridObject === 'Player') {
      return playerImage;
    }
    throw new Error(`No image for grid object: ${gridObject}`);
  };

  return (
    <div className="grid-object" key={gridObject}>
      <img src={getImageForObject()} />
    </div>
  );
}
