import { redirect } from "next/navigation";

export default function ClearCacheAliasPage({ searchParams }) {
  const query = new URLSearchParams(searchParams || {}).toString();
  const target = query ? `/clear-cache?${query}` : "/clear-cache";
  redirect(target);
}
