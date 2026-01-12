import React from 'react';

function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-24 w-24 lg:h-32 lg:w-32 animate-spin rounded-full border-b-4 border-t-4 border-cherry" />
    </div>
  );
}

export default Loading;
