import { Route } from "react-router";
import { lazy } from "react";
import RootLayout from "@/components/layouts/common/RootLayout";

const ForbiddenPage = lazy(() => import("../pages/errors/forbidden"));
const NotFoundPage = lazy(() => import("../pages/errors/not-found"));
const ServerPage = lazy(() => import("../pages/errors/server"));
const TooManyRequestsPage = lazy(() => import("../pages/errors/too-many-requests"));
const UnauthorizedPage = lazy(() => import("../pages/errors/unauthorized"));
const UnexpectedPage = lazy(() => import("../pages/errors/unexpected"));

const errorRouteConfig = [
  { path: "server-error", element: <ServerPage /> },
  { path: "forbidden", element: <ForbiddenPage /> },
  { path: "unauthorized", element: <UnauthorizedPage /> },
  { path: "unexpected", element: <UnexpectedPage /> },
  { path: "too-many-requests", element: <TooManyRequestsPage /> },
  { path: "*", element: <NotFoundPage /> },
];

const ErrorRoutes = (
  <Route element={<RootLayout />}>
    {errorRouteConfig.map(({ path, element }) => (
      <Route key={path} path={path} element={element} />
    ))}
  </Route>
);

export default ErrorRoutes;
