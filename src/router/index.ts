import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Home.vue";
import Auth from "../components/Authentication.vue";
import Layout from "../components/Layout.vue";
import Video from "../components/Video.vue";
import AnalyticDashboard from "@/components/AnalyticDashboard.vue";
import AdminLayout from "@/components/AdminLayout.vue";
import LandingPage from "@/components/LandingPage.vue";
import { getUser, type TUser } from "@/utils/get-user";

const routes = [
  { 
    path: "/Auth", 
    name: "Auth", 
    component: Auth,
    meta: { requiresAuth: false }
  },
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "/",
        name: "LandingPage",
        component: LandingPage,
        meta: { requiresAuth: false },
      },
      {
        path: "/home",
        name: "Home",
        component: Home,
        meta: { requiresAuth: true },
      },
      {
        path: "/video/:id",
        name: "Video",
        component: Video,
        props: true,
        meta: { requiresAuth: true },
      },
    ],
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
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth) {
    try {
      const user: TUser | null= await getUser()
      if (!user) return next("/Auth");
      
      if (to.fullPath.startsWith("/admin")) {
        // if (user.dbUser.role === "admin") {
        //   return next();
        // } else {
        //   return next("/");
        // }
        // commented for demo (give admin access to all users)
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
