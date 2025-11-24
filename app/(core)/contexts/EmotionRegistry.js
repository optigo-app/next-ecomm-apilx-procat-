'use client';

import * as React from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

export function EmotionRegistry({ children }) {
  const cache = React.useMemo(() => {
    const cache = createCache({ key: 'css', prepend: true });
    cache.compat = true;
    return cache;
  }, []);

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
