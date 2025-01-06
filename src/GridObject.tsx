import { GridObjectProps } from "./types";

import conveyorImage from './images/conveyor.png';
import boxImage from './images/block.png';
import playerImage from './images/player.png';
import doorImage from './images/door.png';
import buttonImage from './images/button.png';
import platformImage from './images/platform.png';
import podiumImage from './images/podium.png';
import arrowBlockImage from './images/arrow_block.png';
import arrowButtonImage from './images/arrow_button.png';
import andWireImage from './images/and_wire.png';
import orWireImage from './images/or_wire.png';
import notWireImage from './images/not_wire.png';
import laserEmitterDiagonalBlue from './images/laser_emitter_diagonal_blue.png';
import laserEmitterDiagonalRed from './images/laser_emitter_diagonal_red.png';
import laserEmitterOrthogonalBlue from './images/laser_emitter_orthogonal_blue.png';
import laserEmitterOrthogonalRed from './images/laser_emitter_orthogonal_red.png';
import reflectorDiagonal from './images/reflector_diagonal.png';
import reflectorOrthogonal from './images/reflector_orthogonal.png';

export function GridObject({ objectData }: GridObjectProps) {
  const { type, rotationDirection, isToggle, isDiagonal, laserColor } = objectData;

  const getImageForObject = () => {
    if (type === 'Conveyor') {
      return conveyorImage;
    }
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
    if (type === 'And Wire') {
      return andWireImage;
    }
    if (type === 'Or Wire') {
      return orWireImage;
    }
    if (type === 'Not Wire') {
      return notWireImage;
    }
    if (type === 'Emitter') {
      if (isDiagonal) {
        if (laserColor === 'blue') {
          return laserEmitterDiagonalBlue;
        }
        if (laserColor === 'red') {
          return laserEmitterDiagonalRed;
        }
      }
      if (laserColor === 'blue') {
        return laserEmitterOrthogonalBlue;
      }
      if (laserColor === 'red') {
        return laserEmitterOrthogonalRed;
      }
    }
    if (type === 'Reflector') {
      if (isDiagonal) {
        return reflectorDiagonal;
      }
      return reflectorOrthogonal;
    }
    throw new Error(`No image for grid object: ${type}`);
  };

  return (
    <div className={`grid-object ${rotationDirection ?? ''} ${isToggle ? 'toggle' : ''}`} key={type}>
      <img alt={type} src={getImageForObject()} />
      <div className="highlight-box" />
    </div>
  );
}
