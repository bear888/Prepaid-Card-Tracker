import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import PWAInstallBanner from "@/components/pwa-install-banner";
import CardList from "@/pages/card-list";
import CardDetail from "@/pages/card-detail";
import NotFound from "@/pages/not-found";

function Router() {
    return (
        <Switch>
            <Route path="/" component={CardList} />
            <Route path="/card/:id" component={CardDetail} />
            <Route component={NotFound} />
        </Switch>
    );
}

function App() {
    return (
        <TooltipProvider>
            <div className="max-w-md mx-auto bg-white dark:bg-gray-900 min-h-screen relative">
                <Toaster />
                <Router />
                <PWAInstallBanner />
            </div>
        </TooltipProvider>
    );
}

export default App;
