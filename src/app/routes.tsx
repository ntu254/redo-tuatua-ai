import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "@/features/auth/pages/LoginPage";
import AuthCallback from "@/features/auth/pages/AuthCallbackPage";
import ForgotPassword from "@/features/auth/pages/ForgotPasswordPage";
import ResetPassword from "@/features/auth/pages/ResetPasswordPage";
import SignUp from "@/features/auth/pages/SignUpPage";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import Index from "@/features/landing/pages";
import Profile from "@/features/profile/pages/ProfilePage";
import Quiz from "@/features/quiz/pages";
import OutfitBuilder from "@/features/outfit-builder/pages";
import Recommender from "@/features/recommender/pages";
import StyleProfile from "@/features/style-profile/pages";
import Trends from "@/features/trends/pages/TrendsPage";
import Wardrobe from "@/features/wardrobe/pages";
import PricingPage from "@/features/subscription/pages/PricingPage";
import PaymentResultPage from "@/features/subscription/pages/PaymentResultPage";
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
        <Route path="/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
        <Route path="/recommender" element={<ProtectedRoute><Recommender /></ProtectedRoute>} />
        <Route path="/outfit-builder" element={<ProtectedRoute><OutfitBuilder /></ProtectedRoute>} />
        <Route path="/wardrobe" element={<ProtectedRoute><Wardrobe /></ProtectedRoute>} />
        <Route path="/trends" element={<ProtectedRoute><Trends /></ProtectedRoute>} />
        <Route path="/style-profile" element={<ProtectedRoute><StyleProfile /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/payment/result" element={<PaymentResultPage />} />

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
