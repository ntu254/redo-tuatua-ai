import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { AdminAuthProvider } from "@/features/admin/hooks/useAdminAuth";
import { AdminAuthGuard, AdminLayout } from "@/features/admin/components";
import { Skeleton } from "@/components/ui/skeleton";

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
const SavedAiOutfits = lazy(() => import("@/features/wardrobe/pages").then((m) => ({ default: m.SavedAiOutfitsPage })));
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
    <div className="min-h-[100dvh] bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background font-heading text-lg italic">
            R
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-heading text-lg font-semibold text-foreground">Redo</p>
            <p className="text-xs font-body text-muted-foreground">Đang chuẩn bị trải nghiệm của bạn</p>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <Skeleton className="h-3 w-11/12 rounded-full" />
          <Skeleton className="h-3 w-8/12 rounded-full" />
          <div className="grid grid-cols-3 gap-2 pt-2">
            <Skeleton className="aspect-square rounded-xl" />
            <Skeleton className="aspect-square rounded-xl" />
            <Skeleton className="aspect-square rounded-xl" />
          </div>
        </div>
      </div>
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
          <Route path="/wardrobe" element={<ProtectedRoute><Wardrobe /></ProtectedRoute>} />
          <Route path="/wardrobe/ai-collection" element={<ProtectedRoute><SavedAiOutfits /></ProtectedRoute>} />

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
