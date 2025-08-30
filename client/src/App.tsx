import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CookieBanner } from "@/components/cookie-banner";
import CollaborationPopup from "@/components/CollaborationPopup";
import Home from "@/pages/home";
import Gallery from "@/pages/gallery";
import About from "@/pages/about";
import CookiePolicy from "@/pages/cookie-policy";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminGallery from "@/pages/admin-gallery";
import AdminContent from "@/pages/admin-content";
import AdminContacts from "@/pages/admin-contacts";
import AdminNewsletter from "@/pages/admin-newsletter";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/gallery/:category" component={Gallery} />
      <Route path="/about" component={About} />
      <Route path="/cookie-policy" component={CookiePolicy} />
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/gallery" component={AdminGallery} />
      <Route path="/admin/content" component={AdminContent} />
      <Route path="/admin/contacts" component={AdminContacts} />
      <Route path="/admin/newsletter" component={AdminNewsletter} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <CookieBanner />
        <CollaborationPopup />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
