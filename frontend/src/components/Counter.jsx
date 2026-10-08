import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p role="status" data-testid="count-display">
        count = {count}
      </p>
      <button type="button" onClick={() => setCount((prev) => prev + 1)}>
        Increment
      </button>
    </div>
  );
}
