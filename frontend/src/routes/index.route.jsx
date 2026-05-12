import { createBrowserRouter, createRoutesFromElements, Route } from "react-router";

import RootLayout from "@/components/layouts/common/RootLayout";
import HomePage from "@/pages/Home";

import AuthRoutes from "./auth/auth.routes";
import ErrorRoutes from "./error.routes";
import AdminRoutes from "./admin/admin.routes";
import StudentRoutes from "./student/student.routes";
import ApplicationGuidePage from "@/pages/application-guide";

const routers = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<RootLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route index element={<HomePage />} />
        <Route path="application-guide" element={<ApplicationGuidePage />} />
      </Route>

      {AuthRoutes}
      {StudentRoutes}
      {AdminRoutes}
      {ErrorRoutes}
    </Route>
  )
);

export default routers;
