import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SmoothScrollProvider } from "@/components/SmoothScroll";
import { ThemeProvider } from "@/components/ThemeProvider";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

import { InitialLoader } from "@/components/InitialLoader";
import { CookieConsent } from "@/components/CookieConsent";

// Lazy load Dashboard (includes heavy AI editor and TensorFlow.js)
const Dashboard = lazy(() => import("@/pages/Dashboard"));

function Router() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm font-mono">LOADING_STUDIO...</p>
        </div>
      </div>
    }>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <SmoothScrollProvider>
            <InitialLoader />
            <CookieConsent />
            <Toaster />
            <Router />
          </SmoothScrollProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
