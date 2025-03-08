import { type RouteConfig } from "@react-router/dev/routes";

export default [
  {
    path: "/",
    file: "routes/home.tsx"
  },
  {
    path: "/signup",
    file: "routes/signup.tsx"
  },
  {
    path: "/onboarding",
    file: "routes/onboarding.tsx"
  },
  {
    path: "/login",
    file: "routes/login.tsx"
  },
  {
    path: "/dashboard",
    file: "routes/dashboard.tsx"
  },
  {
    path: "/shipment-upload",
    file: "routes/shipment-upload.tsx"
  },
  {
    path: "/compliance-check",
    file: "routes/compliance-check.tsx"
  },
  {
    path: "/shipment-details",
    file: "routes/shipment-details.tsx"
  },
  {
    path: "/notifications",
    file: "routes/notifications.tsx"
  },
  {
    path: "/reports",
    file: "routes/reports.tsx"
  },
  {
    path: "/user-management",
    file: "routes/user-management.tsx"
  },
  {
    path: "/settings",
    file: "routes/settings.tsx"
  },
  {
    path: "/help",
    file: "routes/help.tsx"
  },
  {
    path: "/forgot-password",
    file: "routes/forgot-password.tsx"
  }
] satisfies RouteConfig;
