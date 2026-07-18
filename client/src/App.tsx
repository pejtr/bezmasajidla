// ============================================================
// BEZMASAJIDLA.CZ — App Router
// "Zelená Metropole" design system
// Routes: /, /restaurace, /restaurace/:slug, /recepty, /recepty/:slug, /mapa, /profil
// ============================================================

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { useScrollToTop } from "./hooks/useScrollToTop";
import CookieConsent from "./components/CookieConsent";

const NotFound = lazy(() => import("@/pages/NotFound"));
const Home = lazy(() => import("./pages/Home"));
const Restaurants = lazy(() => import("./pages/Restaurants"));
const RestaurantDetail = lazy(() => import("./pages/RestaurantDetail"));
const Recipes = lazy(() => import("./pages/Recipes"));
const RecipeDetail = lazy(() => import("./pages/RecipeDetail"));
const MapPage = lazy(() => import("./pages/MapPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const AddRecipe = lazy(() => import("./pages/AddRecipe"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const RecipePillarPage = lazy(() => import("./pages/RecipePillarPage"));
const RestaurantPillarPage = lazy(() => import("./pages/RestaurantPillarPage"));
const VeganRestaurantPillarPage = lazy(() => import("./pages/VeganRestaurantPillarPage"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const InzercePage = lazy(() => import("./pages/InzercePage"));
const PodminkyPage = lazy(() => import("./pages/PodminkyPage"));
const OchranaPage = lazy(() => import("./pages/OchranaPage"));
const KontaktPage = lazy(() => import("./pages/KontaktPage"));

function PageFallback() {
  return <div className="min-h-screen bg-[#F8FAF6]" aria-busy="true" />;
}

function Router() {
  useScrollToTop();
  return (
    <Suspense fallback={<PageFallback />}>
      <Switch>
      <Route path="/" component={Home} />
      <Route path="/restaurace" component={Restaurants} />
      <Route path="/restaurace/vegetarianske-restaurace-praha" component={RestaurantPillarPage} />
      <Route path="/restaurace/veganske-restaurace-praha" component={VeganRestaurantPillarPage} />
      <Route path="/restaurace/:slug" component={RestaurantDetail} />
      <Route path="/recepty" component={Recipes} />
      <Route path="/recepty/ceska-klasika-bez-masa" component={RecipePillarPage} />
      <Route path="/recepty/:slug" component={RecipeDetail} />
      <Route path="/mapa" component={MapPage} />
      <Route path="/profil" component={ProfilePage} />
      <Route path="/o-nas" component={AboutPage} />
      <Route path="/pridat-recept" component={AddRecipe} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogDetail} />
      <Route path="/inzerce" component={InzercePage} />
      <Route path="/podminky" component={PodminkyPage} />
      <Route path="/ochrana-soukromi" component={OchranaPage} />
      <Route path="/kontakt" component={KontaktPage} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <FavoritesProvider>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            <Router />
            <CookieConsent />
          </TooltipProvider>
        </ThemeProvider>
      </FavoritesProvider>
    </ErrorBoundary>
  );
}

export default App;
