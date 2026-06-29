import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
//#region src/utils/api.ts
var baseURL = "http://localhost:8000";
var api = axios.create({ baseURL });
function getAuthState() {
	if (typeof window === "undefined") return null;
	try {
		const raw = window.localStorage.getItem("auth-storage");
		if (!raw) return null;
		return JSON.parse(raw)?.state ?? null;
	} catch {
		return null;
	}
}
api.interceptors.request.use((config) => {
	const state = getAuthState();
	if (state?.token) config.headers.Authorization = `Bearer ${state.token}`;
	return config;
});
var isRefreshing = false;
var pendingRequests = [];
api.interceptors.response.use((response) => response, async (error) => {
	const originalRequest = error.config;
	if (error.response?.status !== 401 || originalRequest._retry) return Promise.reject(error);
	if (originalRequest.url === "/auth/refresh") {
		const state = getAuthState();
		if (state) {
			state.token = null;
			state.refreshToken = null;
			window.localStorage.setItem("auth-storage", JSON.stringify({
				state,
				version: 0
			}));
		}
		window.location.href = "/login";
		return Promise.reject(error);
	}
	if (isRefreshing) return new Promise((resolve) => {
		pendingRequests.push((token) => {
			originalRequest.headers.Authorization = `Bearer ${token}`;
			resolve(api(originalRequest));
		});
	});
	originalRequest._retry = true;
	isRefreshing = true;
	const state = getAuthState();
	if (!state?.refreshToken) {
		isRefreshing = false;
		state.token = null;
		window.localStorage.setItem("auth-storage", JSON.stringify({
			state,
			version: 0
		}));
		window.location.href = "/login";
		return Promise.reject(error);
	}
	try {
		const resp = await axios.post(`${baseURL}/auth/refresh`, { refresh_token: state.refreshToken });
		const newToken = resp.data.access_token;
		state.token = newToken;
		state.refreshToken = resp.data.refresh_token;
		window.localStorage.setItem("auth-storage", JSON.stringify({
			state,
			version: 0
		}));
		isRefreshing = false;
		pendingRequests.forEach((cb) => cb(newToken));
		pendingRequests = [];
		originalRequest.headers.Authorization = `Bearer ${newToken}`;
		return api(originalRequest);
	} catch {
		isRefreshing = false;
		pendingRequests = [];
		state.token = null;
		state.refreshToken = null;
		window.localStorage.setItem("auth-storage", JSON.stringify({
			state,
			version: 0
		}));
		window.location.href = "/login";
		return Promise.reject(error);
	}
});
//#endregion
//#region src/stores/useAuthStore.ts
var useAuthStore = create()(persist((set) => ({
	user: null,
	token: null,
	refreshToken: null,
	setUser: (user) => set({ user }),
	setToken: (token) => set({ token }),
	login: async (email, password) => {
		const formData = new FormData();
		formData.append("username", email);
		formData.append("password", password);
		try {
			const response = await api.post("/auth/token", formData);
			set({
				user: response.data.user,
				token: response.data.access_token,
				refreshToken: response.data.refresh_token
			});
			return response.data;
		} catch (error) {
			throw error.response?.data?.detail || "Login failed";
		}
	},
	register: async (userData) => {
		try {
			return (await api.post("/auth/register", userData)).data;
		} catch (error) {
			const detail = error.response?.data?.detail;
			if (Array.isArray(detail)) throw detail.map((e) => e.msg).join("; ");
			throw detail || "Registration failed";
		}
	},
	updateProfile: async (data) => {
		try {
			const response = await api.put("/auth/me", data);
			set({ user: response.data });
			return response.data;
		} catch (error) {
			throw error.response?.data?.detail || "Update failed";
		}
	},
	logout: () => set({
		user: null,
		token: null,
		refreshToken: null
	})
}), { name: "auth-storage" }));
//#endregion
export { api as n, baseURL as r, useAuthStore as t };
