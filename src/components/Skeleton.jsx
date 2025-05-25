// src/components/Skeleton.jsx
export default function Skeleton({ width, height, borderRadius }) {
    return (
      <div
        className={`bg-gray-300 animate-pulse ${borderRadius ? 'rounded-md' : ''}`}
        style={{ width: width || '100%', height: height || '20px' }}
      ></div>
    );
  }
  