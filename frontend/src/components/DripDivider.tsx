type DripDividerProps = {
  fromColor?: string;
  flip?: boolean;
  className?: string;
};

/** Divisor com uma "gota de esmalte" no centro, ecoando o frasco da logo. */
export default function DripDivider({ flip = false, className = "" }: DripDividerProps) {
  return (
    <div
      className={`pointer-events-none relative -mb-px w-full overflow-hidden leading-[0] ${
        flip ? "rotate-180" : ""
      } ${className}`}
      aria-hidden
    >
      <svg viewBox="0 0 1200 90" className="h-16 w-full sm:h-20" preserveAspectRatio="none">
        <path
          d="M0,0 L1200,0 L1200,40 C1000,40 980,80 900,80 C830,80 815,45 760,45 C705,45 700,90 640,90 C580,90 578,50 520,50 C460,50 445,60 380,60 C300,60 280,30 180,30 C90,30 60,45 0,40 Z"
          className="fill-current"
        />
      </svg>
    </div>
  );
}
