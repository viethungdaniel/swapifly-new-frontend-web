import { getCookie, setCookie, deleteCookie } from "cookies-next";
import type { OptionsType } from "cookies-next/lib/types";

export const saveLocalItem = (key: string, item: any) => {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(item));
  } catch (_) {}
};

export const getLocalItem = <R extends any>(key: string): R => {
  if (typeof window === "undefined") return null as any;
  try {
    return JSON.parse(localStorage.getItem(key) as string);
  } catch {
    try {
      return localStorage.getItem(key) as any;
    } catch {
      return null as any;
    }
  }
};

export const destroyLocalItem = (key: string) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {}
};
export const clearLocal = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.clear();
  } catch {}
};

export const saveSessionItem = (key: string, item: any) => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(key, JSON.stringify(item));
  } catch {}
};

export const getSessionItem = <R extends any>(key: string): R => {
  if (typeof window === "undefined") return null as any;
  try {
    return JSON.parse(sessionStorage.getItem(key) as string);
  } catch {
    try {
      return sessionStorage.getItem(key) as any;
    } catch {
      return null as any;
    }
  }
};

export const destroySessionItem = (key: string) => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(key);
  } catch {}
};

export const clearSession = () => {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.clear();
  } catch {}
};

export const getCookieItem = <R extends any>(
  key: string,
  options?: OptionsType
): R => {
  try {
    return JSON.parse(getCookie(key, options) as any);
  } catch {
    try {
      return getCookie(key, options) as any;
    } catch {
      return null as any;
    }
  }
};

export const destroyCookieItem = (key: string, options?: OptionsType) => {
  try {
    deleteCookie(key, options);
  } catch {}
};

export const saveCookieItem = (
  key: string,
  data: any,
  options?: OptionsType
) => {
  try {
    setCookie(key, data, options);
  } catch {}
};
