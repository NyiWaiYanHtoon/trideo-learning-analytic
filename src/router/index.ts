import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Home.vue";
import Auth from "../components/Authentication.vue";
import Layout from "../components/Layout.vue";
import Video from "../components/Video.vue";
import AnalyticDashboard from "@/components/AnalyticDashboard.vue";
import AdminLayout from "@/components/AdminLayout.vue";

const routes = [
  {
    path: "/",
    redirect: '/home',
    component: Layout,
    children: [
      {
        path: "/home",
        name: "Home",
        component: Home,
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: "/video/:id",
    name: "Video",
    component: Video,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "analytics",
        name: "Analytics",
        component: AnalyticDashboard,
        meta: { requiresAuth: true },
      },
    ],
  },
  { path: "/Auth", name: "Auth", component: Auth },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth) {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_EXPRESS_SERVER_URL}/api/auth/me`,
        {
          credentials: "include",
        }
      );
      if (!res.ok) return next("/Auth");

      const data = await res.json();
      const userRole = data.user?.role;

      //if it is admin routes
      if (to.fullPath.startsWith("/admin")) {
        if (userRole === "admin") {
          return next();
        } else {
          return next("/home");
        }
      }
      return next();
    } catch (err) {
      console.log("Auth check failed:", err);
      next("/Auth");
    }
  } else {
    next();
  }
});

export default router;
