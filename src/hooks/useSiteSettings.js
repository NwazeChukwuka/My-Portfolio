import { useMemo } from 'react';
import usePortfolioContent from './usePortfolioContent';

const useSiteSettings = () => {
  const content = usePortfolioContent();

  return useMemo(() => {
    return {
      general: content.general || {},
      contact: content.contact || {},
    };
  }, [content]);
};

export default useSiteSettings;
