import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { MOCK_REPORTS } from '../data/mockReports';

const STORAGE_KEY = 'njsoss_reports';

const loadReports = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const userReports = raw ? JSON.parse(raw) : [];
    // Merge mock reports (by id dedup) with user reports
    const allIds = new Set(userReports.map((r) => r.id));
    const merged = [...userReports, ...MOCK_REPORTS.filter((r) => !allIds.has(r.id))];
    return merged.sort((a, b) => b.timestamp - a.timestamp);
  } catch {
    return [...MOCK_REPORTS].sort((a, b) => b.timestamp - a.timestamp);
  }
};

const saveUserReports = (reports) => {
  // Only save user-created reports (not mock ones)
  const mockIds = new Set(MOCK_REPORTS.map((r) => r.id));
  const userReports = reports.filter((r) => !mockIds.has(r.id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userReports));
};

export const useReportStore = create((set, get) => ({
  reports: loadReports(),
  selectedSystem: null,
  showHeatmap: false,
  filterSystem: null,
  filterThreat: null,

  setSelectedSystem: (system) => set({ selectedSystem: system }),
  setShowHeatmap: (val) => set({ showHeatmap: val }),
  setFilterSystem: (system) => set({ filterSystem: system }),
  setFilterThreat: (level) => set({ filterThreat: level }),

  addReport: (reportData, user) => {
    const report = {
      id: uuidv4(),
      ...reportData,
      reportedBy: user?.username || 'Anonymous',
      timestamp: Date.now(),
      upvotes: 0,
      verified: false,
      verifiedBy: [],
    };
    const { reports } = get();
    const updated = [report, ...reports];
    saveUserReports(updated);
    set({ reports: updated });
    return report;
  },

  upvoteReport: (reportId, userId) => {
    const { reports } = get();
    const updated = reports.map((r) => {
      if (r.id === reportId) {
        const alreadyUpvoted = r.upvotedBy?.includes(userId);
        if (alreadyUpvoted) return r;
        return {
          ...r,
          upvotes: (r.upvotes || 0) + 1,
          upvotedBy: [...(r.upvotedBy || []), userId],
        };
      }
      return r;
    });
    saveUserReports(updated);
    set({ reports: updated });
  },

  verifyReport: (reportId, username) => {
    const { reports } = get();
    const updated = reports.map((r) => {
      if (r.id === reportId) {
        if (r.verifiedBy?.includes(username)) return r;
        const verifiedBy = [...(r.verifiedBy || []), username];
        return {
          ...r,
          verifiedBy,
          verified: verifiedBy.length >= 2,
        };
      }
      return r;
    });
    saveUserReports(updated);
    set({ reports: updated });
  },

  getReportsBySystem: (systemId) => {
    const { reports } = get();
    return reports.filter((r) => r.system === systemId);
  },

  getFilteredReports: () => {
    const { reports, filterSystem, filterThreat } = get();
    let filtered = reports;
    if (filterSystem) filtered = filtered.filter((r) => r.system === filterSystem);
    if (filterThreat) filtered = filtered.filter((r) => r.threatLevel >= filterThreat);
    return filtered;
  },

  getSystemDangerScore: (systemId) => {
    const { reports } = get();
    const sysReports = reports.filter((r) => r.system === systemId);
    if (!sysReports.length) return 0;
    const recent = sysReports.filter((r) => Date.now() - r.timestamp < 86400000 * 7);
    return recent.length;
  },

  getTopDangerousSystems: () => {
    const { reports } = get();
    const systemCounts = {};
    reports.forEach((r) => {
      if (!systemCounts[r.system]) systemCounts[r.system] = { count: 0, totalThreat: 0 };
      systemCounts[r.system].count++;
      systemCounts[r.system].totalThreat += r.threatLevel;
    });
    return Object.entries(systemCounts)
      .map(([system, data]) => ({
        system,
        count: data.count,
        avgThreat: data.totalThreat / data.count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  },

  getLeaderboard: () => {
    const { reports } = get();
    const reporters = {};
    reports.forEach((r) => {
      if (!reporters[r.reportedBy]) reporters[r.reportedBy] = { name: r.reportedBy, count: 0, upvotes: 0 };
      reporters[r.reportedBy].count++;
      reporters[r.reportedBy].upvotes += r.upvotes || 0;
    });
    return Object.values(reporters)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  },

  getStats: () => {
    const { reports } = get();
    const totalReports = reports.length;
    const verifiedReports = reports.filter((r) => r.verified).length;
    const activePirates = reports
      .filter((r) => Date.now() - r.timestamp < 86400000)
      .reduce((sum, r) => sum + (r.pirateCount || 0), 0);
    return { totalReports, verifiedReports, activePirates };
  },
}));
