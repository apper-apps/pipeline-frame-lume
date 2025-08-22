import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="shimmer h-10 w-64 rounded-lg mb-4"></div>
          <div className="shimmer h-6 w-96 rounded"></div>
        </div>

        {/* Kanban Board Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, columnIndex) => (
            <div key={columnIndex} className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="shimmer h-6 w-24 rounded"></div>
                <div className="shimmer h-6 w-8 rounded-full"></div>
              </div>

              {/* Lead Cards */}
              <div className="space-y-3">
                {[...Array(3)].map((_, cardIndex) => (
                  <div key={cardIndex} className="bg-white/80 rounded-lg p-4 border border-slate-200/30">
                    <div className="shimmer h-5 w-32 rounded mb-2"></div>
                    <div className="shimmer h-4 w-24 rounded mb-3"></div>
                    <div className="flex justify-between items-center">
                      <div className="shimmer h-4 w-16 rounded"></div>
                      <div className="shimmer h-5 w-20 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Floating Add Button Skeleton */}
        <div className="fixed bottom-6 right-6">
          <div className="shimmer h-14 w-14 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;