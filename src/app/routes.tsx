import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "@/features/auth/pages/LoginPage";
import ForgotPassword from "@/features/auth/pages/ForgotPasswordPage";
import ResetPassword from "@/features/auth/pages/ResetPasswordPage";
import SignUp from "@/features/auth/pages/SignUpPage";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import Index from "@/features/landing/pages";
import Profile from "@/features/profile/pages/ProfilePage";
import Quiz from "@/features/quiz/pages";
import Recommender from "@/features/recommender/pages";
import StyleProfile from "@/features/style-profile/pages";
import Trends from "@/features/trends/pages/TrendsPage";
import Wardrobe from "@/features/wardrobe/pages";
import NotFound from "@/pages/NotFound";

import { AdminAuthProvider } from "@/features/admin/hooks/useAdminAuth";
import { AdminAuthGuard, AdminLayout } from "@/features/admin/components";
import {
  AdminAiEngine,
  AdminAnalytics,
  AdminDashboard,
  AdminFeedback,
  AdminLoginPage,
  AdminNotifications,
  AdminPlansBilling,
  AdminProducts,
  AdminSettings,
  AdminTrends,
  AdminUsers,
} from "@/features/admin/pages";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/recommender" element={<Recommender />} />
        <Route path="/wardrobe" element={<Wardrobe />} />
        <Route path="/trends" element={<Trends />} />
        <Route path="/style-profile" element={<StyleProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        <Route path="/admin/login" element={<AdminAuthProvider><AdminLoginPage /></AdminAuthProvider>} />
        <Route path="/admin" element={<AdminAuthProvider><AdminAuthGuard><AdminLayout /></AdminAuthGuard></AdminAuthProvider>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="ai-engine" element={<AdminAiEngine />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="trends" element={<AdminTrends />} />
          <Route path="plans" element={<AdminPlansBilling />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="feedback" element={<AdminFeedback />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
