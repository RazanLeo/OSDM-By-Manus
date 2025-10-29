import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { UserModeProvider } from "./contexts/UserModeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ProductsMarket from "./pages/ProductsMarket";
import ServicesMarket from "./pages/ServicesMarket";
import JobsMarket from "./pages/JobsMarket";
import SellerProducts from "./pages/dashboard/seller/Products";
import SellerServices from "./pages/dashboard/seller/Services";
import SellerContracts from "./pages/dashboard/seller/Contracts";
import SellerWallet from "./pages/dashboard/seller/Wallet";
import BuyerPurchases from "./pages/dashboard/buyer/Purchases";
import BuyerOrders from "./pages/dashboard/buyer/Orders";
import BuyerProjects from "./pages/dashboard/buyer/Projects";
import BuyerWallet from "./pages/dashboard/buyer/Wallet";
import ProductDetails from "./pages/markets/ProductDetails";
import About from "./pages/content/About";
import Terms from "./pages/content/Terms";
import Privacy from '@/pages/content/Privacy';
import IPPolicy from '@/pages/content/IPPolicy';
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import ServiceDetails from "./pages/markets/ServiceDetails";
import JobDetails from "./pages/markets/JobDetails";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Search from "./pages/Search";
import Settings from "./pages/Settings";
import AddReview from "./pages/AddReview";
import AdminDashboard from "./pages/admin/Dashboard";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
       <Route path="/" component={Home} />
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/register" component={Register} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/search" component={Search} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/markets/products" component={ProductsMarket} />
      <Route path="/markets/products/:id" component={ProductDetails} />
      <Route path="/markets/services" component={ServicesMarket} />
      <Route path="/markets/services/:id" component={ServiceDetails} />
      <Route path="/markets/jobs" component={JobsMarket} />
      <Route path="/markets/jobs/:id" component={JobDetails} />
      <Route path="/dashboard/seller/products" component={SellerProducts} />
      <Route path="/dashboard/seller/services" component={SellerServices} />
      <Route path="/dashboard/seller/contracts" component={SellerContracts} />
      <Route path="/dashboard/seller/wallet" component={SellerWallet} />
      <Route path="/dashboard/buyer/purchases" component={BuyerPurchases} />
      <Route path="/dashboard/buyer/orders" component={BuyerOrders} />
      <Route path="/dashboard/buyer/projects" component={BuyerProjects} />
      <Route path="/dashboard/buyer/wallet" component={BuyerWallet} />
      <Route path="/about" component={About} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/ip-policy" component={IPPolicy} />
      <Route path="/messages" component={Messages} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/settings" component={Settings} />
      <Route path="/add-review" component={AddReview} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider defaultLanguage="ar">
        <UserModeProvider>
          <ThemeProvider
            defaultTheme="light"
            // switchable
          >
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </ThemeProvider>
        </UserModeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
