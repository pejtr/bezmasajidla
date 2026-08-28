// ============================================================
// BEZMASAJIDLA.CZ — App Router
// "Zelená Metropole" design system
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
const QuickDinnersPillarPage = lazy(() => import("./pages/QuickDinnersPillarPage"));
const GlutenFreePillarPage = lazy(() => import("./pages/GlutenFreePillarPage"));
const MealPlannerPage = lazy(() => import("./pages/MealPlannerPage"));
const VeganWarriorPage = lazy(() => import("./pages/VeganWarriorPage"));
const PaymentResultPage = lazy(() => import("./pages/PaymentResultPage"));
const RestaurantPillarPage = lazy(() => import("./pages/RestaurantPillarPage"));
const VeganRestaurantPillarPage = lazy(() => import("./pages/VeganRestaurantPillarPage"));
const BrnoRestaurantPillarPage = lazy(() => import("./pages/BrnoRestaurantPillarPage"));
const OstravaRestaurantPillarPage = lazy(() => import("./pages/OstravaRestaurantPillarPage"));
const PlzenRestaurantPillarPage = lazy(() => import("./pages/PlzenRestaurantPillarPage"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const InzercePage = lazy(() => import("./pages/InzercePage"));
const B2BListingPage = lazy(() => import("./pages/B2BListingPage"));
const PodminkyPage = lazy(() => import("./pages/PodminkyPage"));
const OchranaPage = lazy(() => import("./pages/OchranaPage"));
const KontaktPage = lazy(() => import("./pages/KontaktPage"));

const DistrictPillarPage = lazy(() => import("./pages/DistrictPillarPage"));
const IngredientPillarPage = lazy(() => import("./pages/IngredientPillarPage"));

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
        <Route path="/restaurace/praha/vinohrady">{() => <DistrictPillarPage districtKey="vinohrady" />}</Route>
        <Route path="/restaurace/praha/karlin">{() => <DistrictPillarPage districtKey="karlin" />}</Route>
        <Route path="/restaurace/praha/smichov">{() => <DistrictPillarPage districtKey="smichov" />}</Route>
        <Route path="/restaurace/praha/stare-mesto">{() => <DistrictPillarPage districtKey="stare-mesto" />}</Route>
        <Route path="/restaurace/vegetarianske-restaurace-brno" component={BrnoRestaurantPillarPage} />
        <Route path="/restaurace/veganske-restaurace-ostrava" component={OstravaRestaurantPillarPage} />
        <Route path="/restaurace/bezmase-restaurace-plzen" component={PlzenRestaurantPillarPage} />
        <Route path="/restaurace/:slug" component={RestaurantDetail} />
        <Route path="/recepty" component={Recipes} />
        <Route path="/recepty/tofu">{() => <IngredientPillarPage ingredientKey="tofu" />}</Route>
        <Route path="/recepty/cizrna">{() => <IngredientPillarPage ingredientKey="cizrna" />}</Route>
        <Route path="/recepty/cocka">{() => <IngredientPillarPage ingredientKey="cocka" />}</Route>
        <Route path="/recepty/kvetak">{() => <IngredientPillarPage ingredientKey="kvetak" />}</Route>
        <Route path="/recepty/tempeh">{() => <IngredientPillarPage ingredientKey="tempeh" />}</Route>
        <Route path="/recepty/ceska-klasika-bez-masa" component={RecipePillarPage} />
        <Route path="/recepty/rychle-bezmase-vecere" component={QuickDinnersPillarPage} />
        <Route path="/recepty/bezlepkove-recepty" component={GlutenFreePillarPage} />
        <Route path="/tydenni-planovac-receptu" component={MealPlannerPage} />
        <Route path="/bezmasy-warrior-vyzva" component={VeganWarriorPage} />
        <Route path="/platba/uspech">{() => <PaymentResultPage status="success" />}</Route>
        <Route path="/platba/zruseno">{() => <PaymentResultPage status="cancelled" />}</Route>
        <Route path="/recepty/:slug" component={RecipeDetail} />
        <Route path="/mapa" component={MapPage} />
        <Route path="/profil" component={ProfilePage} />
        <Route path="/o-nas" component={AboutPage} />
        <Route path="/pridat-recept" component={AddRecipe} />
        <Route path="/admin" component={AdminPage} />
        <Route path="/blog" component={BlogPage} />
        <Route path="/blog/:slug" component={BlogDetail} />
        <Route path="/inzerce" component={InzercePage} />
        <Route path="/inzerce/pridat-podnik" component={B2BListingPage} />
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
