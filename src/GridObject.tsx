import { GridObjectProps } from "./types";

import conveyorImage from './images/conveyor.png';
import boxImage from './images/block.png';
import playerImage from './images/player.png';
import playerTwoImage from './images/player_two.png';
import doorImage from './images/door.png';
import buttonImage from './images/button.png';
import platformImage from './images/platform.png';
import arrowBlockImage from './images/arrow_block.png';
import arrowButtonImage from './images/arrow_button.png';
import andWireImage from './images/and_wire.png';
import orWireImage from './images/or_wire.png';
import notWireImage from './images/not_wire.png';
import laserEmitterOrthogonalBlue from './images/laser_emitter_orthogonal_blue.png';
import laserEmitterOrthogonalRed from './images/laser_emitter_orthogonal_red.png';
import reflectorOrthogonal from './images/reflector_orthogonal.png';
import immovableLaserEmitterOrthogonalBlue from './images/immovable_laser_emitter_orthogonal_blue.png';
import immovableLaserEmitterOrthogonalRed from './images/immovable_laser_emitter_orthogonal_red.png';
import immovableReflectorOrthogonal from './images/immovable_reflector_orthogonal.png';
import receiverBlue from './images/receiver_blue.png';
import receiverRed from './images/receiver_red.png';
import goalImage from './images/goal_cell.png';
import barrierImage from './images/rotator_barrier.png';
import countdownPlatform0 from './images/countdown_platform_0.png';
import countdownPlatform1 from './images/countdown_platform_1.png';
import countdownPlatform2 from './images/countdown_platform_2.png';
import countdownPlatform3 from './images/countdown_platform_3.png';
import countdownPlatform4 from './images/countdown_platform_4.png';
import countdownPlatform5 from './images/countdown_platform_5.png';
import lineOfSightCreature from './images/line_of_sight_creature.png';
import fire from './images/fire.png';
import waterCreature from './images/water_creature.png';
import bucketEmpty from './images/bucket_empty.png';
import bucketFull from './images/bucket_full.png';
import exitImage from './images/exit.png';

export function GridObject({ objectData }: GridObjectProps) {
  const { type, rotationDirection, isImmovable, laserColor, countdownValue, creatureType } = objectData;

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
    if (type === 'Player Two') {
      return playerTwoImage;
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
    if (isImmovable) {
      if (type === 'Emitter') {
        if (laserColor === 'blue') {
          return immovableLaserEmitterOrthogonalBlue;
        }
        if (laserColor === 'red') {
          return immovableLaserEmitterOrthogonalRed;
        }
      }
      if (type === 'Reflector') {
        return immovableReflectorOrthogonal;
      }
    }
    if (type === 'Emitter') {
      if (laserColor === 'blue') {
        return laserEmitterOrthogonalBlue;
      }
      if (laserColor === 'red') {
        return laserEmitterOrthogonalRed;
      }
    }
    if (type === 'Reflector') {
      return reflectorOrthogonal;
    }
    if (type === 'Receiver') {
      if (laserColor === 'blue') {
        return receiverBlue;
      }
      if (laserColor === 'red') {
        return receiverRed;
      }
    }
    if (type === 'Goal') {
      return goalImage;
    }
    if (type === 'Barrier') {
      return barrierImage;
    }
    if (type === 'Countdown') {
      switch (countdownValue) {
        case 0:
          return countdownPlatform0;
        case 1:
          return countdownPlatform1;
        case 2:
          return countdownPlatform2;
        case 3:
          return countdownPlatform3;
        case 4:
          return countdownPlatform4;
        case 5:
          return countdownPlatform5;
        default:
          throw new Error(`Invalid countdown value: ${countdownValue}`);
      }
    }
    if (type === 'Creature') {
      switch (creatureType) {
        case 'Line of Sight':
          return lineOfSightCreature;
        case 'Water':
          return waterCreature;
        default:
          throw new Error(`Invalid creature type: ${creatureType}`);
      }
    }
    if (type === 'Fire') {
      return fire;
    }
    if (type === 'Bucket') {
      if (objectData.isBucketFull) {
        return bucketFull;
      }
      return bucketEmpty;
    }
    if (type === 'Exit') {
      return exitImage;
    }
    throw new Error(`No image for grid object: ${type}`);
  };

  return (
    <div className={`grid-object ${rotationDirection ?? ''}`} key={type}>
      <img alt={type} src={getImageForObject()} />
      <div className="highlight-box" />
    </div>
  );
}
