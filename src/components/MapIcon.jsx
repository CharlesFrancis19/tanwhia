export default function MapIcon({ size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 5l6 2 6-2v14l-6 2-6-2-6 2V7l6-2z" stroke="currentColor" strokeWidth="2" />
      <circle cx="15" cy="7" r="1.6" fill="currentColor" />
    </svg>
  );
}
