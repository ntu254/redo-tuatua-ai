import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Loader2 } from "lucide-react";

import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { AdminAuthProvider } from "@/features/admin/hooks/useAdminAuth";
import { AdminAuthGuard, AdminLayout } from "@/features/admin/components";

const Login = lazy(() => import("@/features/auth/pages/LoginPage"));
const AuthCallback = lazy(() => import("@/features/auth/pages/AuthCallbackPage"));
const ForgotPassword = lazy(() => import("@/features/auth/pages/ForgotPasswordPage"));
const ResetPassword = lazy(() => import("@/features/auth/pages/ResetPasswordPage"));
const SignUp = lazy(() => import("@/features/auth/pages/SignUpPage"));
const Index = lazy(() => import("@/features/landing/pages"));
const Profile = lazy(() => import("@/features/profile/pages/ProfilePage"));
const Quiz = lazy(() => import("@/features/quiz/pages"));
const OutfitBuilder = lazy(() => import("@/features/outfit-builder/pages"));
const Recommender = lazy(() => import("@/features/recommender/pages"));
const StyleProfile = lazy(() => import("@/features/style-profile/pages"));
const Trends = lazy(() => import("@/features/trends/pages/TrendsPage"));
const Wardrobe = lazy(() => import("@/features/wardrobe/pages"));
const PricingPage = lazy(() => import("@/features/subscription/pages/PricingPage"));
const PaymentResultPage = lazy(() => import("@/features/subscription/pages/PaymentResultPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

const AdminLoginPage = lazy(() => import("@/features/admin/pages").then((module) => ({ default: module.AdminLoginPage })));
const AdminDashboard = lazy(() => import("@/features/admin/pages").then((module) => ({ default: module.AdminDashboard })));
const AdminUsers = lazy(() => import("@/features/admin/pages").then((module) => ({ default: module.AdminUsers })));
const AdminAiEngine = lazy(() => import("@/features/admin/pages").then((module) => ({ default: module.AdminAiEngine })));
const AdminProducts = lazy(() => import("@/features/admin/pages").then((module) => ({ default: module.AdminProducts })));
const AdminTrends = lazy(() => import("@/features/admin/pages").then((module) => ({ default: module.AdminTrends })));
const AdminPlansBilling = lazy(() => import("@/features/admin/pages").then((module) => ({ default: module.AdminPlansBilling })));
const AdminAnalytics = lazy(() => import("@/features/admin/pages").then((module) => ({ default: module.AdminAnalytics })));
const AdminNotifications = lazy(() => import("@/features/admin/pages").then((module) => ({ default: module.AdminNotifications })));
const AdminFeedback = lazy(() => import("@/features/admin/pages").then((module) => ({ default: module.AdminFeedback })));
const AdminSettings = lazy(() => import("@/features/admin/pages").then((module) => ({ default: module.AdminSettings })));

function RouteLoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-5 h-5 animate-spin text-accent" />
    </div>
  );
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoadingFallback />}>
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
      </Suspense>
    </BrowserRouter>
  );
}
