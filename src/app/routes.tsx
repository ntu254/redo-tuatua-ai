import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "@/features/auth/pages/LoginPage";
import SignUp from "@/features/auth/pages/SignUpPage";
import Index from "@/features/landing/pages";
import Profile from "@/features/profile/pages/ProfilePage";
import Quiz from "@/features/quiz/pages";
import Recommender from "@/features/recommender/pages";
import StyleProfile from "@/features/style-profile/pages";
import Trends from "@/features/trends/pages/TrendsPage";
import Wardrobe from "@/features/wardrobe/pages";
import NotFound from "@/pages/NotFound";

import { AdminLayout } from "@/features/admin/components";
import {
  AdminAnalytics,
  AdminDashboard,
  AdminFeedback,
  AdminOutfits,
  AdminProducts,
  AdminSettings,
  AdminTrends,
  AdminUsers,
  AdminWardrobe,
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
        <Route path="/profile" element={<Profile />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="wardrobe" element={<AdminWardrobe />} />
          <Route path="outfits" element={<AdminOutfits />} />
          <Route path="trends" element={<AdminTrends />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="feedback" element={<AdminFeedback />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
