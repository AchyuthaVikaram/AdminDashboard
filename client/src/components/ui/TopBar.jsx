// File: /src/components/ui/TopBar.jsx
import { useState } from "react";
import { ChevronDown, Bell, User, RefreshCw, Download, Menu, X } from "lucide-react";
import { Button } from "./button";

const TopBar = ({
  filters,
  filterOptions,
  onFilterChange,
  onRefresh,
  onExport,
  refreshing,
  lastUpdated,
}) => {
  const [timeRange, setTimeRange] = useState(
    filters?.timeRange || "Last 7 Days"
  );
  const [category, setCategory] = useState(
    filters?.category || "All Categories"
  );
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
    setShowMobileMenu(false);
  };

  const closeAllDropdowns = () => {
    setShowTimeDropdown(false);
    setShowCategoryDropdown(false);
    setShowExportDropdown(false);
    setShowMobileMenu(false);
  };

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl p-4 sm:p-6 shadow-lg border border-white/10 relative z-10">
      {/* Mobile Header */}
      <div className="flex justify-between items-start md:hidden mb-4">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-white/60 text-sm mt-1">Monitor performance</p>
        </div>
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10"
        >
          {showMobileMenu ? (
            <X className="w-5 h-5 text-white/70" />
          ) : (
            <Menu className="w-5 h-5 text-white/70" />
          )}
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex justify-between items-center">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white">Analytics Dashboard</h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
            <p className="text-white/60 text-sm sm:text-base">
              Monitor system performance and user engagement
            </p>
            {lastUpdated && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/50 text-xs sm:text-sm">
                  Updated at {lastUpdated.toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Controls */}
        <div className="flex flex-wrap items-center gap-3 lg:gap-4">
          {/* Time Range Dropdown */}
          <div className="relative z-50">
            <label
              htmlFor="time-range-select"
              className="text-xs sm:text-sm text-white/60 block mb-1"
            >
              Time Range:
            </label>
            <div className="relative w-full rounded-md p-[2px] bg-gray-500">
              <button
                id="time-range-select"
                onClick={() => {
                  setShowTimeDropdown(!showTimeDropdown);
                  setShowCategoryDropdown(false);
                  setShowExportDropdown(false);
                }}
                className="bg-[#121212] text-xs sm:text-sm text-white px-3 sm:px-4 py-2 rounded-md w-full flex items-center justify-between gap-2 hover:bg-[#1a1a1a] transition-colors min-w-[120px] sm:min-w-[140px]"
              >
                <span className="truncate">{timeRange}</span>
                <ChevronDown
                  className={`w-3 sm:w-4 h-3 sm:h-4 text-white/60 transition-transform flex-shrink-0 ${
                    showTimeDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showTimeDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-white/10 rounded-md shadow-lg z-[60] max-h-48 overflow-y-auto">
                  {filterOptions.timeRanges?.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => handleTimeRangeSelect(range)}
                      className={`w-full text-left text-xs sm:text-sm px-3 sm:px-4 py-2 hover:bg-white/5 text-white first:rounded-t-md last:rounded-b-md transition-colors ${
                        range.value === timeRange ? "bg-white/10" : ""
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
              className="text-xs sm:text-sm text-white/60 block mb-1"
            >
              Category:
            </label>
            <div className="relative w-full rounded-md p-[2px] bg-gray-500">
              <button
                id="category-select"
                onClick={() => {
                  setShowCategoryDropdown(!showCategoryDropdown);
                  setShowTimeDropdown(false);
                  setShowExportDropdown(false);
                }}
                className="bg-[#121212] text-xs sm:text-sm text-white px-3 sm:px-4 py-2 rounded-md w-full flex items-center justify-between gap-2 hover:bg-[#1a1a1a] transition-colors min-w-[120px] sm:min-w-[140px]"
              >
                <span className="truncate">{category}</span>
                <ChevronDown
                  className={`w-3 sm:w-4 h-3 sm:h-4 text-white/60 transition-transform flex-shrink-0 ${
                    showCategoryDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-white/10 rounded-md shadow-lg z-[60] max-h-48 overflow-y-auto">
                  {filterOptions.categories?.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => handleCategorySelect(cat)}
                      className={`w-full text-left px-3 sm:px-4 py-2 hover:bg-white/5 text-white text-xs sm:text-sm first:rounded-t-md last:rounded-b-md transition-colors ${
                        cat.value === category ? "bg-white/10" : ""
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
          <div className="flex items-center gap-2 sm:gap-3 ml-0 sm:ml-4 mt-4 sm:mt-6">
            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10 disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCw
                className={`w-4 sm:w-5 h-4 sm:h-5 text-white/70 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />
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
                <Download className="w-4 sm:w-5 h-4 sm:h-5 text-white/70" />
              </button>
              {showExportDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-[#1a1a1a] border border-white/10 rounded-md shadow-lg z-[60] min-w-[120px]">
                  <button
                    onClick={() => handleExport("json")}
                    className="w-full text-left px-4 py-2 hover:bg-white/5 text-white text-xs sm:text-sm first:rounded-t-md transition-colors"
                  >
                    Export JSON
                  </button>
                  <button
                    onClick={() => handleExport("csv")}
                    className="w-full text-left px-4 py-2 hover:bg-white/5 text-white text-xs sm:text-sm last:rounded-b-md transition-colors"
                  >
                    Export CSV
                  </button>
                </div>
              )}
            </div>

            {/* Notifications */}
            <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10">
              <Bell className="w-4 sm:w-5 h-4 sm:h-5 text-white/70" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden mt-4 space-y-4 border-t border-white/10 pt-4">
          {/* Last Updated Info */}
          {lastUpdated && (
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/50 text-sm">
                Updated at {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
          )}

          {/* Mobile Filters */}
          <div className="space-y-4">
            {/* Time Range */}
            <div className="relative z-50">
              <label className="text-sm text-white/60 block mb-2">
                Time Range:
              </label>
              <div className="relative w-full rounded-md p-[2px] bg-gray-500">
                <button
                  onClick={() => {
                    setShowTimeDropdown(!showTimeDropdown);
                    setShowCategoryDropdown(false);
                    setShowExportDropdown(false);
                  }}
                  className="bg-[#121212] text-sm text-white px-4 py-2 rounded-md w-full flex items-center justify-between gap-2 hover:bg-[#1a1a1a] transition-colors"
                >
                  <span>{timeRange}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-white/60 transition-transform ${
                      showTimeDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {showTimeDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-white/10 rounded-md shadow-lg z-[60] max-h-48 overflow-y-auto">
                    {filterOptions.timeRanges?.map((range) => (
                      <button
                        key={range.value}
                        onClick={() => handleTimeRangeSelect(range)}
                        className={`w-full text-left text-sm px-4 py-2 hover:bg-white/5 text-white first:rounded-t-md last:rounded-b-md transition-colors ${
                          range.value === timeRange ? "bg-white/10" : ""
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="relative z-50">
              <label className="text-sm text-white/60 block mb-2">
                Category:
              </label>
              <div className="relative w-full rounded-md p-[2px] bg-gray-500">
                <button
                  onClick={() => {
                    setShowCategoryDropdown(!showCategoryDropdown);
                    setShowTimeDropdown(false);
                    setShowExportDropdown(false);
                  }}
                  className="bg-[#121212] text-sm text-white px-4 py-2 rounded-md w-full flex items-center justify-between gap-2 hover:bg-[#1a1a1a] transition-colors"
                >
                  <span>{category}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-white/60 transition-transform ${
                      showCategoryDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a1a] border border-white/10 rounded-md shadow-lg z-[60] max-h-48 overflow-y-auto">
                    {filterOptions.categories?.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => handleCategorySelect(cat)}
                        className={`w-full text-left px-4 py-2 hover:bg-white/5 text-white text-sm first:rounded-t-md last:rounded-b-md transition-colors ${
                          cat.value === category ? "bg-white/10" : ""
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              {/* Refresh Button */}
              <button
                onClick={() => {
                  onRefresh();
                  setShowMobileMenu(false);
                }}
                disabled={refreshing}
                className="flex items-center gap-2 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10 disabled:opacity-50"
                title="Refresh Data"
              >
                <RefreshCw
                  className={`w-4 h-4 text-white/70 ${
                    refreshing ? "animate-spin" : ""
                  }`}
                />
                <span className="text-sm text-white/70">Refresh</span>
              </button>

              {/* Notifications */}
              <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10">
                <Bell className="w-4 h-4 text-white/70" />
              </button>
            </div>

            {/* Export Options */}
            <div className="flex gap-2">
              <button
                onClick={() => handleExport("json")}
                className="px-3 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10 text-sm text-white/70"
              >
                JSON
              </button>
              <button
                onClick={() => handleExport("csv")}
                className="px-3 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/10 text-sm text-white/70"
              >
                CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Close dropdowns when clicking outside */}
      {(showTimeDropdown || showCategoryDropdown || showExportDropdown) && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeAllDropdowns}
        />
      )}
    </div>
  );
};

export default TopBar;