import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ProductsMarket from "./pages/markets/Products";
import ServicesMarket from "./pages/markets/Services";
import JobsMarket from "./pages/markets/Jobs";
import SellerProducts from "./pages/dashboard/seller/Products";
import SellerServices from "./pages/dashboard/seller/Services";
import SellerContracts from "./pages/dashboard/seller/Contracts";
import SellerWallet from "./pages/dashboard/seller/Wallet";
import BuyerPurchases from "./pages/dashboard/buyer/Purchases";
import BuyerOrders from "./pages/dashboard/buyer/Orders";
import BuyerProjects from "./pages/dashboard/buyer/Projects";
import BuyerWallet from "./pages/dashboard/buyer/Wallet";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/markets/products" component={ProductsMarket} />
      <Route path="/markets/services" component={ServicesMarket} />
      <Route path="/markets/jobs" component={JobsMarket} />
      <Route path="/dashboard/seller/products" component={SellerProducts} />
      <Route path="/dashboard/seller/services" component={SellerServices} />
      <Route path="/dashboard/seller/contracts" component={SellerContracts} />
      <Route path="/dashboard/seller/wallet" component={SellerWallet} />
      <Route path="/dashboard/buyer/purchases" component={BuyerPurchases} />
      <Route path="/dashboard/buyer/orders" component={BuyerOrders} />
      <Route path="/dashboard/buyer/projects" component={BuyerProjects} />
      <Route path="/dashboard/buyer/wallet" component={BuyerWallet} />
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
        <ThemeProvider
          defaultTheme="light"
          // switchable
        >
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
