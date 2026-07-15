import { Toaster } from "@/components/common/ui/toaster";
import { Toaster as Sonner } from "@/components/common/ui/sonner";
import { TooltipProvider } from "@/components/common/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/common/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import VehicleDetail from "./pages/VehicleDetail";
import VehicleNew from "./pages/VehicleNew";
import VehicleEdit from "./pages/VehicleEdit";
import Drivers from "./pages/Drivers";
import DriverNew from "./pages/DriverNew";
import DriverDetail from "./pages/DriverDetail";
import DriverEdit from "./pages/DriverEdit";
import Maintenance from "./pages/Maintenance";
import Vendors from "./pages/Vendors";
import DriverPortal from "./pages/DriverPortal";
import NotFound from "./pages/NotFound";

import FleetSync from "./pages/FleetSync";
import Login from "./pages/Login";
import MfaSetup from "./pages/Login/MfaSetup";
import MfaVerify from "./pages/Login/MfaVerify";
import FuelData from "./pages/FuelData";
// Route for compliance page added to handle non-technical security overview | params : none | returns : React Node
import Compliance from "./pages/Compliance";
import Customers from "./pages/Customers";
import CustomerNew from "./pages/CustomerNew";
import CustomerDetail from "./pages/CustomerDetail";
import Settings from "./pages/Settings";

import { LanguageProvider } from "@/hooks/useLanguage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/mfa-setup" element={<MfaSetup />} />
            <Route path="/mfa-verify" element={<MfaVerify />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/vehicles/new" element={<VehicleNew />} />
              <Route path="/vehicles/:id" element={<VehicleDetail />} />
              <Route path="/vehicles/:id/edit" element={<VehicleEdit />} />
              <Route path="/drivers" element={<Drivers />} />
              <Route path="/drivers/new" element={<DriverNew />} />
              <Route path="/drivers/:id" element={<DriverDetail />} />
              <Route path="/drivers/:id/edit" element={<DriverEdit />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/vendors" element={<Vendors />} />
              {/* Placeholder routes */}
              <Route path="/fuel-data" element={<FuelData />} />
              <Route path="/fleet-sync" element={<FleetSync />} />
              <Route path="/driver" element={<DriverPortal />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/help" element={<Dashboard />} />
              <Route path="/compliance" element={<Compliance />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/new" element={<CustomerNew />} />
              <Route path="/customers/:clientNumber" element={<CustomerDetail />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;



