import _ from 'lodash';
import { useId } from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { TooltipProps } from './types';

export function Tooltip({ children, tooltipContent }: TooltipProps) {
  const tooltipId = useId();

  if (_.isNil(tooltipContent)) {
    return <>{children}</>;
  }

  return (
    <div
      className="tooltip-wrapper"
      data-tooltip-id={tooltipId}
      data-tooltip-place="top"
      data-tooltip-variant="light"
    >
      {children}
      <ReactTooltip
        id={tooltipId}
        className="tooltip-element"
      >
        {tooltipContent}
      </ReactTooltip>
    </div>
  );
}
