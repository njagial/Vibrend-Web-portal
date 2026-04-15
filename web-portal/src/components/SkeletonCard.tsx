import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white border border-slate-50 rounded-2xl p-4 mb-4 animate-pulse">
      <div className="flex flex-col md:flex-row items-center gap-6">
        
        {/* Airline Logo & Name Placeholder */}
        <div className="flex items-center gap-3 w-full md:w-1/5">
          <div className="w-10 h-10 bg-slate-100 rounded-lg"></div>
          <div className="flex-1">
            <div className="h-3 bg-slate-100 rounded w-20 mb-2"></div>
            <div className="h-2 bg-slate-50 rounded w-12"></div>
          </div>
        </div>

        {/* Timeline Placeholder */}
        <div className="flex flex-1 items-center justify-between w-full px-2">
          <div className="text-center">
            <div className="h-4 bg-slate-100 rounded w-12 mb-2"></div>
            <div className="h-2 bg-slate-50 rounded w-8 mx-auto"></div>
          </div>

          <div className="flex-1 px-10">
            <div className="h-1 bg-slate-50 w-full relative flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-100 absolute left-0"></div>
              <div className="w-4 h-4 rounded-full bg-slate-100"></div>
              <div className="w-2 h-2 rounded-full bg-slate-100 absolute right-0"></div>
            </div>
          </div>

          <div className="text-center">
            <div className="h-4 bg-slate-100 rounded w-12 mb-2"></div>
            <div className="h-2 bg-slate-50 rounded w-8 mx-auto"></div>
          </div>
        </div>

        {/* Price & Button Placeholder */}
        <div className="w-full md:w-1/4 flex items-center justify-end gap-4">
          <div className="text-right">
            <div className="h-2 bg-slate-50 rounded w-10 mb-2 ml-auto"></div>
            <div className="h-5 bg-slate-100 rounded w-24"></div>
          </div>
          <div className="w-12 h-12 bg-slate-100 rounded-xl"></div>
        </div>

      </div>
    </div>
  );
};

export default SkeletonCard;