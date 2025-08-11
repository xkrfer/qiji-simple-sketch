import { useState, useEffect } from 'react';

import { SinResponsiveBreakpoint } from '../types';
import { getSinCurrentBreakpoint } from '../utils';

/**
 * 响应式Hook - 监听屏幕尺寸变化
 */
export function useSinResponsive() {
  const [breakpoint, setBreakpoint] = useState<SinResponsiveBreakpoint>(
    getSinCurrentBreakpoint()
  );

  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getSinCurrentBreakpoint());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === 'sm',
    isTablet: breakpoint === 'md',
    isDesktop: breakpoint === 'lg' || breakpoint === 'xl',
    isLargeDesktop: breakpoint === 'xl',
  };
}
