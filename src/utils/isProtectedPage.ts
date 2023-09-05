const matchers = ["/dashboard"];

export function isRouteProtected(currentRoute: string): boolean {
  return matchers.some((protectedRoute) =>
    currentRoute.includes(protectedRoute)
  );
}
