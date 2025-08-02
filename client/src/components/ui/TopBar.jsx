import { useState } from 'react';
import { ChevronDown, Bell, User, RefreshCw, Download } from 'lucide-react';
import { Button } from './button';

const TopBar = ({ 
  filters, 
  filterOptions, 
  onFilterChange, 
  onRefresh, 
  onExport, 
  refreshing, 
  lastUpdated 
}) => {
  const [timeRange, setTimeRange] = useState(filters?.timeRange || 'Last 7 Days');
  const [category, setCategory] = useState(filters?.category || 'All Categories');
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);

  const handleApplyFilters = () => {
    onFilterChange({ timeRange, category });
  };

  const handleTimeRangeSelect = (range) => {
    setTimeRange(range.value);
    setShowTimeDropdown(false);
    // Auto-apply filters when selection changes
    onFilterChange({ timeRange: range.value, category });
  };

  const handleCategorySelect = (cat) => {
    setCategory(cat.value);
    setShowCategoryDropdown(false);
    // Auto-apply filters when selection changes
    onFilterChange({ timeRange, category: cat.value });
  };

  const handleExport = (format) => {
    onExport(format);
    setShowExportDropdown(false);
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/10 relative z-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
          <div className="flex items-center gap-4 mt-1">
            <p className="text-white/60">Monitor system performance and user engagement</p>
            {lastUpdated && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/50 text-sm">
                  Updated: {lastUpdated.toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Time Range Dropdown */}
          <div className="relative z-50">
            <label 
              htmlFor="time-range-select"
              className="text-sm text-white/60 block mb-1"
            >
              Time Range:
            </label>
            <div className="relative w-full rounded-md p-[2px] bg-gradient-to-r from-[#00FFFF] to-[#39FF14]">
              <button
                id="time-range-select"
                onClick={() => {
                  setShowTimeDropdown(!showTimeDropdown);
                  setShowCategoryDropdown(false);
                  setShowExportDropdown(false);
                }}
                className="bg-[#121212] text-white px-4 py-2 rounded-md w-full flex items-center justify-between gap-2 hover:bg-[#1a1a1a] transition-colors min-w-[140px]"
              >
                <span>{timeRange}</span>
                <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${showTimeDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showTimeDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-white/10 rounded-md shadow-lg z-[60] max-h-48 overflow-y-auto">
                  {filterOptions.timeRanges?.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => handleTimeRangeSelect(range)}
                      className={`w-full text-left px-4 py-2 hover:bg-white/5 text-white text-sm first:rounded-t-md last:rounded-b-md transition-colors ${
                        range.value === timeRange ? 'bg-white/10' : ''
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="relative z-50">
            <label 
              htmlFor="category-select"
              className="text-sm text-white/60 block mb-1"
            >
              Category:
            </label>
            <div className="relative w-full rounded-md p-[2px] bg-gradient-to-r from-[#00FFFF] to-[#39FF14]">
              <button
                id="category-select"
                onClick={() => {
                  setShowCategoryDropdown(!showCategoryDropdown);
                  setShowTimeDropdown(false);
                  setShowExportDropdown(false);
                }}
                className="bg-[#121212] text-white px-4 py-2 rounded-md w-full flex items-center justify-between gap-2 hover:bg-[#1a1a1a] transition-colors min-w-[140px]"
              >
                <span>{category}</span>
                <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-white/10 rounded-md shadow-lg z-[60] max-h-48 overflow-y-auto">
                  {filterOptions.categories?.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => handleCategorySelect(cat)}
                      className={`w-full text-left px-4 py-2 hover:bg-white/5 text-white text-sm first:rounded-t-md last:rounded-b-md transition-colors ${
                        cat.value === category ? 'bg-white/10' : ''
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 ml-4 mt-6">
            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10 disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 text-white/70 ${refreshing ? 'animate-spin' : ''}`} />
            </button>

            {/* Export Dropdown */}
            <div className="relative z-50">
              <button
                onClick={() => {
                  setShowExportDropdown(!showExportDropdown);
                  setShowTimeDropdown(false);
                  setShowCategoryDropdown(false);
                }}
                className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10"
                title="Export Data"
              >
                <Download className="w-5 h-5 text-white/70" />
              </button>
              {showExportDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-[#1a1a1a] border border-white/10 rounded-md shadow-lg z-[60] min-w-[120px]">
                  <button
                    onClick={() => handleExport('json')}
                    className="w-full text-left px-4 py-2 hover:bg-white/5 text-white text-sm first:rounded-t-md transition-colors"
                  >
                    Export JSON
                  </button>
                  <button
                    onClick={() => handleExport('csv')}
                    className="w-full text-left px-4 py-2 hover:bg-white/5 text-white text-sm last:rounded-b-md transition-colors"
                  >
                    Export CSV
                  </button>
                </div>
              )}
            </div>

            {/* Notifications */}
            <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10">
              <Bell className="w-5 h-5 text-white/70" />
            </button>

            {/* Profile */}
            <div className="w-8 h-8 bg-gradient-to-r from-[#00FFFF] to-[#39FF14] rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-black" />
            </div>
          </div>
        </div>
      </div>

      {/* Close dropdowns when clicking outside */}
      {(showTimeDropdown || showCategoryDropdown || showExportDropdown) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowTimeDropdown(false);
            setShowCategoryDropdown(false);
            setShowExportDropdown(false);
          }}
        />
      )}
    </div>
  );
};

export default TopBar;