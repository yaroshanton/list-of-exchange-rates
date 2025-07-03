import { createRouter, createWebHistory } from "vue-router";

const Home = () => import("./pages/Home.vue");
const ChangedRates = () => import("./pages/ChangedRates.vue");
const SearchRates = () => import("./pages/SearchRates.vue");
const EditCurrency = () => import("./pages/EditCurrency.vue");

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/changed", name: "ChangedRates", component: ChangedRates },
  { path: "/search", name: "SearchRates", component: SearchRates },
  {
    path: "/edit/:cc",
    name: "EditCurrency",
    component: EditCurrency,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
