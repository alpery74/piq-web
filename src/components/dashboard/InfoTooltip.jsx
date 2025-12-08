import { Info } from 'lucide-react';

const InfoTooltip = ({ id, content, title, activeTooltip, setActiveTooltip }) => {
  const isVisible = activeTooltip === id;

  return (
    <div className="relative inline-block group">
      <button
        type="button"
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 hover:bg-primary-100 transition-all duration-200 group-hover:scale-110"
        onMouseEnter={() => setActiveTooltip(id)}
        onMouseLeave={() => setActiveTooltip(null)}
        onClick={(e) => {
          e.preventDefault();
          setActiveTooltip(isVisible ? null : id);
        }}
      >
        <Info className="w-3.5 h-3.5 text-gray-500 group-hover:text-primary-600" />
      </button>
      {isVisible && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 pointer-events-none">
          <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-2xl border border-gray-700">
            {title && <div className="font-semibold mb-1 text-sm">{title}</div>}
            <div className="text-xs leading-relaxed text-gray-200">{content}</div>
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;
