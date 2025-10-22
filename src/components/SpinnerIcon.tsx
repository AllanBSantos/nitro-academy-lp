interface SpinnerIconProps {
  className?: string;
}

export function SpinnerIcon({ className = "w-6 h-6" }: SpinnerIconProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Fidget Spinner - 3 arms with circles */}
      <g transform="translate(100, 100)">
        {/* Top arm */}
        <path
          d="M -25,-50 Q -35,-80 -15,-100 Q 0,-110 15,-100 Q 35,-80 25,-50 L 15,-50 Q 20,-70 10,-80 Q 0,-85 -10,-80 Q -20,-70 -15,-50 Z"
          fillRule="evenodd"
        />
        {/* Top circle outer ring */}
        <circle cx="0" cy="-85" r="22" stroke="currentColor" strokeWidth="6" fill="none" />
        {/* Top circle inner */}
        <circle cx="0" cy="-85" r="12" fill="currentColor" opacity="0.3" />
        
        {/* Bottom Left arm */}
        <g transform="rotate(120)">
          <path
            d="M -25,-50 Q -35,-80 -15,-100 Q 0,-110 15,-100 Q 35,-80 25,-50 L 15,-50 Q 20,-70 10,-80 Q 0,-85 -10,-80 Q -20,-70 -15,-50 Z"
            fillRule="evenodd"
          />
          {/* Bottom Left circle outer ring */}
          <circle cx="0" cy="-85" r="22" stroke="currentColor" strokeWidth="6" fill="none" />
          {/* Bottom Left circle inner */}
          <circle cx="0" cy="-85" r="12" fill="currentColor" opacity="0.3" />
        </g>
        
        {/* Bottom Right arm */}
        <g transform="rotate(240)">
          <path
            d="M -25,-50 Q -35,-80 -15,-100 Q 0,-110 15,-100 Q 35,-80 25,-50 L 15,-50 Q 20,-70 10,-80 Q 0,-85 -10,-80 Q -20,-70 -15,-50 Z"
            fillRule="evenodd"
          />
          {/* Bottom Right circle outer ring */}
          <circle cx="0" cy="-85" r="22" stroke="currentColor" strokeWidth="6" fill="none" />
          {/* Bottom Right circle inner */}
          <circle cx="0" cy="-85" r="12" fill="currentColor" opacity="0.3" />
        </g>
        
        {/* Center circle - larger */}
        <circle cx="0" cy="0" r="35" fill="currentColor" />
        {/* Center circle outer ring */}
        <circle cx="0" cy="0" r="35" stroke="currentColor" strokeWidth="6" fill="none" />
        {/* Center circle inner detail */}
        <circle cx="0" cy="0" r="20" fill="currentColor" opacity="0.2" />
      </g>
    </svg>
  );
}
