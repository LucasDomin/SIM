export const adminRoutes = ["/admin/login", "/admin/dashboard", "/admin/content", "/admin/media", "/admin/settings"];

export function isAdminPath(pathname = window.location.pathname) {
  return pathname === "/admin" || adminRoutes.some((route) => pathname.startsWith(route));
}

export function go(path: string) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}