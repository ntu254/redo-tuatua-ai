import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Quiz from "./pages/Quiz.tsx";
import Recommender from "./pages/Recommender.tsx";
import Wardrobe from "./pages/Wardrobe.tsx";
import Trends from "./pages/Trends.tsx";
import StyleProfile from "./pages/StyleProfile.tsx";
import Login from "./pages/Login.tsx";
import SignUp from "./pages/SignUp.tsx";
import Profile from "./pages/Profile.tsx";
import NotFound from "./pages/NotFound.tsx";

import AdminLayout from "./components/admin/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminUsers from "./pages/admin/AdminUsers.tsx";
import AdminWardrobe from "./pages/admin/AdminWardrobe.tsx";
import AdminOutfits from "./pages/admin/AdminOutfits.tsx";
import AdminTrends from "./pages/admin/AdminTrends.tsx";
import AdminProducts from "./pages/admin/AdminProducts.tsx";
import AdminAnalytics from "./pages/admin/AdminAnalytics.tsx";
import AdminFeedback from "./pages/admin/AdminFeedback.tsx";
import AdminSettings from "./pages/admin/AdminSettings.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
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

          {/* Admin */}
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
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
