import { Route } from "react-router";
import RootLayout from "@/components/layouts/common/RootLayout";
import { ForbiddenPage, NotFoundPage, ServerPage, TooManyRequestsPage, UnauthorizedPage, UnexpectedPage } from "@/pages/errors/";

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
