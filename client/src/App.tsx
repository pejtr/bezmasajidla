// ============================================================
// BEZMASAJIDLA.CZ — App Router
// "Zelená Metropole" design system
// Routes: /, /restaurace, /restaurace/:slug, /recepty, /recepty/:slug, /mapa, /profil
// ============================================================

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import Home from "./pages/Home";
import { useScrollToTop } from "./hooks/useScrollToTop";
import Restaurants from "./pages/Restaurants";
import RestaurantDetail from "./pages/RestaurantDetail";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import MapPage from "./pages/MapPage";
import ProfilePage from "./pages/ProfilePage";
import AboutPage from "./pages/AboutPage";
import AddRecipe from "./pages/AddRecipe";
import AdminPage from "./pages/AdminPage";
import BlogPage from "./pages/BlogPage";
import BlogDetail from "./pages/BlogDetail";
import InzercePage from "./pages/InzercePage";
import PodminkyPage from "./pages/PodminkyPage";
import OchranaPage from "./pages/OchranaPage";
function Router() {
  useScrollToTop();
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/restaurace" component={Restaurants} />
      <Route path="/restaurace/:slug" component={RestaurantDetail} />
      <Route path="/recepty" component={Recipes} />
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
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
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
          </TooltipProvider>
        </ThemeProvider>
      </FavoritesProvider>
    </ErrorBoundary>
  );
}

export default App;
