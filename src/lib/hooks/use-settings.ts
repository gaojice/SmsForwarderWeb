"use client";

import { useState, useEffect, useCallback } from "react";
import type { AppSettings } from "@/lib/types";
import { SETTINGS_STORAGE_KEY } from "@/lib/constants";

const defaultSettings: AppSettings = {
  serverUrl: "",
  secret: "",
};

export function useSettings() {
  const [settings, setSettingsState] = useState<AppSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettingsState({ ...defaultSettings, ...parsed });
      }
    } catch {
      // ignore parse errors
    }
    setIsLoaded(true);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettingsState((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }
      return updated;
    });
  }, []);

  const isConfigured = Boolean(settings.serverUrl);

  return { settings, updateSettings, isConfigured, isLoaded };
}
