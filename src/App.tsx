import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AccountTypeSelection from "./pages/AccountTypeSelection";
import LanguageSelection from "./pages/LanguageSelection";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import TraderDetailsForm from "./pages/TraderDetailsForm";
import SupplierDetailsForm from "./pages/SupplierDetailsForm";
import MedicalRepDetailsForm from "./pages/MedicalRepDetailsForm";
import OrderBookerDetailsForm from "./pages/OrderBookerDetailsForm";
import About from "./pages/About";
import Community from "./pages/Community";
import Complaints from "./pages/Complaints";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/account-type" element={<AccountTypeSelection />} />
            <Route path="/trader-details" element={<TraderDetailsForm />} />
            <Route path="/language-selection" element={<LanguageSelection />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/community" element={<Community />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/contact/:type" element={<Contact />} />
            <Route path="/supplier-details" element={<SupplierDetailsForm />} />
            <Route path="/medical-rep-details" element={<MedicalRepDetailsForm />} />
            <Route path="/order-booker-details" element={<OrderBookerDetailsForm />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
