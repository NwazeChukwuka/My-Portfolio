import { createContext, createElement, useContext, useEffect, useMemo, useState } from 'react';
import personalData from '../data/personalData';
import { supabase } from '../lib/supabaseClient';

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function deepMerge(base, override) {
  if (!isPlainObject(base) || !isPlainObject(override)) return override ?? base;
  const merged = { ...base };
  Object.keys(override).forEach((key) => {
    const baseValue = base[key];
    const overrideValue = override[key];
    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      merged[key] = deepMerge(baseValue, overrideValue);
    } else {
      merged[key] = overrideValue;
    }
  });
  return merged;
}

let cachedSettingsMap = null;
let settingsPromise = null;

const PortfolioContentContext = createContext(personalData);

export const PortfolioContentProvider = ({ children }) => {
  const [settingsMap, setSettingsMap] = useState(cachedSettingsMap || {});

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      if (!supabase) return;
      if (cachedSettingsMap) {
        setSettingsMap(cachedSettingsMap);
        return;
      }

      if (!settingsPromise) {
        settingsPromise = supabase.from('site_settings').select('key, value');
      }

      const { data, error } = await settingsPromise;
      if (error || !mounted || !Array.isArray(data)) return;
      const map = {};
      data.forEach((item) => {
        map[item.key] = item.value || {};
      });
      cachedSettingsMap = map;
      setSettingsMap(map);
    };

    loadSettings();
    return () => {
      mounted = false;
    };
  }, []);

  const content = useMemo(() => {
    const contentOverride = isPlainObject(settingsMap.content) ? settingsMap.content : {};
    const merged = deepMerge(personalData, contentOverride);

    if (isPlainObject(settingsMap.general)) {
      merged.general = deepMerge(merged.general || {}, settingsMap.general);
    }

    if (isPlainObject(settingsMap.contact)) {
      merged.contact = deepMerge(merged.contact || {}, settingsMap.contact);
    }

    if (isPlainObject(settingsMap.cvs)) {
      merged.general = merged.general || {};
      merged.general.cvs = deepMerge(merged.general.cvs || {}, settingsMap.cvs);
    }

    return merged;
  }, [settingsMap]);

  return createElement(PortfolioContentContext.Provider, { value: content }, children);
};

const usePortfolioContent = () => useContext(PortfolioContentContext);

export default usePortfolioContent;
