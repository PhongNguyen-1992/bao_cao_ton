import React from 'react';
import { Threads } from 'react-bits';

export default function MyPage() {
  return (
    <div>
      <h1>Thread Animation Demo</h1>
      <Threads
        text="Hello React Bits!"
        speed={1.2}
        color="#1DA1F2"
        // …các prop tuỳ chỉnh khác
      />
    </div>
  );
}