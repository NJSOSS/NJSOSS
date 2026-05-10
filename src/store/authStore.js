import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

const AVATAR_COLORS = [
  '#00d4ff', '#ff2233', '#ff7700', '#00ff88', '#aa44ff',
  '#ff44aa', '#44ffff', '#ffaa00', '#ff4444', '#44aaff',
];

const getAvatarColor = (username) => {
  if (!username) return AVATAR_COLORS[0];
  const idx = username.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

const loadUser = () => {
  try {
    const raw = localStorage.getItem('njsoss_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveUser = (user) => {
  if (user) {
    localStorage.setItem('njsoss_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('njsoss_user');
  }
};

const loadUsers = () => {
  try {
    const raw = localStorage.getItem('njsoss_users');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveUsers = (users) => {
  localStorage.setItem('njsoss_users', JSON.stringify(users));
};

export const useAuthStore = create((set, get) => ({
  user: loadUser(),
  error: null,
  isLoading: false,

  register: (username, email, password) => {
    const users = loadUsers();
    if (users.find((u) => u.email === email)) {
      set({ error: 'Email already registered.' });
      return false;
    }
    if (users.find((u) => u.username === username)) {
      set({ error: 'Username already taken.' });
      return false;
    }
    const user = {
      id: uuidv4(),
      username,
      email,
      passwordHash: btoa(password),
      avatar: username[0].toUpperCase(),
      avatarColor: getAvatarColor(username),
      joinDate: new Date().toISOString(),
      reports: 0,
      upvotesGiven: 0,
      rank: 'Scout',
    };
    saveUsers([...users, user]);
    const { passwordHash: _, ...publicUser } = user;
    saveUser(publicUser);
    set({ user: publicUser, error: null });
    return true;
  },

  login: (email, password) => {
    const users = loadUsers();
    const found = users.find(
      (u) => u.email === email && u.passwordHash === btoa(password)
    );
    if (!found) {
      set({ error: 'Invalid email or password.' });
      return false;
    }
    const { passwordHash: _, ...publicUser } = found;
    saveUser(publicUser);
    set({ user: publicUser, error: null });
    return true;
  },

  logout: () => {
    saveUser(null);
    set({ user: null, error: null });
  },

  clearError: () => set({ error: null }),

  incrementReports: () => {
    const { user } = get();
    if (!user) return;
    const updated = { ...user, reports: (user.reports || 0) + 1 };
    // Update rank based on reports
    if (updated.reports >= 50) updated.rank = 'Admiral';
    else if (updated.reports >= 20) updated.rank = 'Commander';
    else if (updated.reports >= 10) updated.rank = 'Captain';
    else if (updated.reports >= 5) updated.rank = 'Pilot';
    else updated.rank = 'Scout';

    saveUser(updated);
    // Update in users array too
    const users = loadUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      users[idx] = { ...users[idx], reports: updated.reports, rank: updated.rank };
      saveUsers(users);
    }
    set({ user: updated });
  },
}));
