import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Quiz from "./pages/Quiz.tsx";
import Recommender from "./pages/Recommender.tsx";
import Wardrobe from "./pages/Wardrobe.tsx";
import Analysis from "./pages/Analysis.tsx";
import Trends from "./pages/Trends.tsx";
import StyleProfile from "./pages/StyleProfile.tsx";
import NotFound from "./pages/NotFound.tsx";

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
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/trends" element={<Trends />} />
          <Route path="/style-profile" element={<StyleProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
