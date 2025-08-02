import StatsCards from '../components/ui/StatsCards';
import ContentPerformanceChart from '../components/ui/ContentPerformanceChart';
import UserDistributionChart from '../components/ui/UserDistributionChart';
import SystemPerformanceChart from '../components/ui/SystemPerformanceChart';
import TopBar from '../components/ui/TopBar';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { showErrorToast, showSuccessToast } from '../utils/toastUtil';
import { BASE_URL } from '../utils/constant';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    timeRange: 'Last 7 Days',
    category: 'All Categories'
  });
  const [filterOptions, setFilterOptions] = useState({
    timeRanges: [],
    categories: []
  });
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();

  // Auto-refresh interval (30 seconds)
  const REFRESH_INTERVAL = 30000;

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "null");
      
      // Redirect if not logged in
      if (!token || !user) {
        console.log("No token or user found, redirecting to login");
        navigate("/login", { replace: true });
        return false;
      }

      // Redirect non-admin users
      if (user?.role !== "admin") {
        console.log("User is not admin, redirecting to welcome");
        navigate("/welcome", { replace: true });
        return false;
      }

      return true;
    };

    if (checkAuth()) {
      setIsInitialized(true);
      // Initial data fetch only after auth check passes
      fetchAnalyticsData(false, true); // isInitial = true
    }
  }, [navigate]);

  // Set up auto-refresh only after initialization
  useEffect(() => {
    if (!isInitialized) return;

    const interval = setInterval(() => {
      fetchAnalyticsData(true); // Silent refresh
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [isInitialized]);

  const getAuthConfig = useCallback(() => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  }, []);

  const fetchAnalyticsData = async (silent = false, isInitial = false) => {
    try {
      if (!silent) setLoading(true);
      
      const config = getAuthConfig();
      const params = new URLSearchParams({
        timeRange: filters.timeRange,
        category: filters.category
      });

      const response = await axios.get(
        `${BASE_URL}/api/analytics-data/overview?${params}`, 
        config
      );

      if (response.data.success) {
        setAnalyticsData(response.data.data);
        setFilterOptions(response.data.data.filterOptions);
        setLastUpdated(new Date(response.data.data.metadata.lastUpdated));
        
        // Only show success toast on initial load or manual refresh
        if (isInitial) {
          showSuccessToast('Analytics data loaded successfully');
        }
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      
      // Only show error toast if not silent
      if (!silent) {
        showErrorToast('Failed to load analytics data');
      }
      
      // Handle authentication errors
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleFilterChange = async (newFilters) => {
    try {
      setLoading(true);
      setFilters(newFilters);
      
      const config = getAuthConfig();
      const response = await axios.post(
        `${BASE_URL}/api/analytics-data/apply-filters`,
        newFilters,
        config
      );

      if (response.data.success) {
        setAnalyticsData(response.data.data);
        setLastUpdated(new Date(response.data.data.timestamp));
        showSuccessToast('Filters applied successfully');
      }
    } catch (error) {
      console.error('Error applying filters:', error);
      showErrorToast('Failed to apply filters');
      
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      
      const config = getAuthConfig();
      const response = await axios.post(
        `${BASE_URL}/api/analytics-data/refresh`,
        {},
        config
      );

      if (response.data.success) {
        setAnalyticsData(response.data.data);
        setLastUpdated(new Date(response.data.data.lastRefresh));
        showSuccessToast('Analytics data refreshed');
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      showErrorToast('Failed to refresh data');
      
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      }
    } finally {
      setRefreshing(false);
    }
  };

  const handleExport = async (format = 'json') => {
    try {
      const config = getAuthConfig();
      const params = new URLSearchParams({
        format,
        timeRange: filters.timeRange
      });

      const response = await axios.get(
        `${BASE_URL}/api/analytics-data/export?${params}`,
        {
          ...config,
          responseType: 'blob'
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics-${Date.now()}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      showSuccessToast('Analytics data exported successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      showErrorToast('Failed to export data');
      
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      }
    }
  };

  // Don't render anything until auth check is complete
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00FFFF] mx-auto mb-4"></div>
          <div className="text-white text-xl">Checking authentication...</div>
        </div>
      </div>
    );
  }

  if (loading && !analyticsData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00FFFF] mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading analytics...</div>
          <div className="text-white/60 text-sm mt-2">Fetching real-time data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      <TopBar 
        filters={filters}
        filterOptions={filterOptions}
        onFilterChange={handleFilterChange}
        onRefresh={handleRefresh}
        onExport={handleExport}
        refreshing={refreshing}
        lastUpdated={lastUpdated}
      />

      {/* Stats Cards */}
      <StatsCards 
        data={analyticsData?.stats} 
        loading={loading}
      />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContentPerformanceChart 
          data={analyticsData?.contentPerformance}
          loading={loading}
        />
        <UserDistributionChart 
          data={analyticsData?.userDistribution}
          loading={loading}
        />
      </div>

      {/* Full Width Chart */}
      <SystemPerformanceChart 
        data={analyticsData?.systemPerformance}
        loading={loading}
      />

      {/* Real-time indicator */}
      {analyticsData && (
        <div className="fixed bottom-4 right-4 bg-white/5 backdrop-blur-md p-3 rounded-lg border border-white/10 z-40">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white/70 text-sm">
              Live • Last updated: {lastUpdated?.toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;