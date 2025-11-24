import { useRouter } from 'next/router';
import { useMemo } from 'react';

const useLocation = () => {
  const router = useRouter();

  // Ensure asPath is defined before attempting to use it
  const pathname = router.asPath ? router.asPath.split('?')[0] : '/'; // fallback to '/' if asPath is undefined

  // Ensure asPath has a query string before trying to parse it
  const searchParams = router.asPath && router.asPath.includes('?') 
    ? new URLSearchParams(router.asPath.split('?')[1]) 
    : new URLSearchParams();  // empty searchParams if no query string

  const location = useMemo(() => {
    return {
      pathname,
      search: router.asPath && router.asPath.includes('?') ? `?${searchParams.toString()}` : '',
      hash: router.asPath && router.asPath.includes('#') ? router.asPath.split('#')[1] : '',
      query: Object.fromEntries(searchParams.entries()), // Convert searchParams to an object
    };
  }, [router.asPath]);

  return location;
};

export default useLocation;
