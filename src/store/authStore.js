import { create } from "zustand";

const useAuthStore = create((set) => ({
  token: null,
  role: null,
  memberId: null,
  login: (token) => set({ token }),
  setUserInfo: ({ memberId, role }) => set({ memberId, role }),
  logout: () => set({ token: null, role: null, memberId: null }),
}));

export default useAuthStore;
