import { QueryClient, QueryFunction } from "@tanstack/react-query";

export const getQueryFn: <T>() => QueryFunction<T> =
  () =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string);
    if (!res.ok) {
      throw new Error(`${res.status}: ${res.statusText}`);
    }
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn(),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
  },
});
