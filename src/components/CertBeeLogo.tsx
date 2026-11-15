export function CertBeeMark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* Honeycomb / Wax-Seal Hexagon */}
      <path
        d="M18 2.5L31.4 10.25V25.75L18 33.5L4.6 25.75V10.25L18 2.5Z"
        fill="#F6C844"
        stroke="#12151E"
        strokeWidth="2.1"
        strokeLinejoin="round"
      />
      {/* Antennae */}
      <path
        d="M16.4 13.2C15.5 11.2 14.3 10.4 13 10.4M19.6 13.2C20.5 11.2 21.7 10.4 23 10.4"
        stroke="#12151E"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Symmetrical Wings */}
      <path
        d="M16.8 16.4C12.4 12.2 8.4 13.4 9.2 17.2C9.9 20.1 13.8 19.8 16.8 18.2V16.4Z"
        fill="#FFFFFF"
        stroke="#12151E"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M19.2 16.4C23.6 12.2 27.6 13.4 26.8 17.2C26.1 20.1 22.2 19.8 19.2 18.2V16.4Z"
        fill="#FFFFFF"
        stroke="#12151E"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* Bee Body */}
      <rect
        x="14.5"
        y="13.2"
        width="7"
        height="12.6"
        rx="3.5"
        fill="#12151E"
      />
      {/* Accent Stripes */}
      <path
        d="M15.3 18.4H20.7M15.7 21.6H20.3"
        stroke="#F6C844"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CertBeeLogo({
  size = 'md',
}: {
  size?: 'sm' | 'md';
}) {
  const iconCls = size === 'sm' ? 'h-7 w-7' : 'h-8 w-8';
  const textCls = size === 'sm' ? 'text-base' : 'text-lg';

  return (
    <span className="inline-flex items-center gap-2 select-none whitespace-nowrap shrink-0">
      <CertBeeMark className={`${iconCls} shrink-0`} />
      <span className={`font-display ${textCls} font-bold tracking-tight text-[#12151E]`}>
        CertBee
      </span>
    </span>
  );
}
