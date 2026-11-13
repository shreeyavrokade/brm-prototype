import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import SubmissionDetail from "./pages/SubmissionDetail";
import ImportSubmission from "./pages/ImportSubmission";
import TransactionImport from "./pages/TransactionImport";

import ProfilesSubmissionDetail from "./pages/ProfilesSubmissionDetail";
import RatingsSubmissionDetail from "./pages/RatingsSubmissionDetail";
import MarketEconomicModel from "./pages/MarketEconomicModel";
import MEMLoadReview from "./pages/MEMLoadReview";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const Router = import.meta.env.VITE_ROUTER_MODE === "hash" ? HashRouter : BrowserRouter;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/submission/:id" element={<SubmissionDetail />} />
          <Route path="/import-submission" element={<ImportSubmission />} />
          <Route path="/transaction-import" element={<TransactionImport />} />
          <Route path="/transaction/:id" element={<Navigate to="/" replace />} />
          <Route path="/profiles/:id" element={<ProfilesSubmissionDetail />} />
          <Route path="/ratings/:id" element={<RatingsSubmissionDetail />} />
          <Route path="/market-economic" element={<MarketEconomicModel />} />
          <Route path="/mem/load-review" element={<MEMLoadReview />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
