import { createWebHistory, createRouter } from "vue-router";
import { useUserStore } from "../stores/useUserStore";

// Import Components
import Signup from '../user/Signup.vue';
import EndSignup from '../user/EndSignup.vue';
import Main from "../common/Main.vue";
import PortfolioDetail from "../portfolio/PortfolioDetail.vue";
import StockDetail from "../stock/StockDetail.vue";
import UserPort from "../common/UserPort.vue";
import CreatePortfolio from "../portfolio/PortCreate.vue";
import StockList from "../stock/StockList.vue";
import Login from "../user/Login.vue";
import Error404 from "../components/404Page.vue";
import StockLikesList from "../stock/StockLikesList.vue";
import About from "../etc/About.vue";
import Privacy from "../etc/Privacy.vue";
import Profile from "../user/Profile.vue";
import EditProfile from "../user/EditProfile.vue";

// Login Check Middleware
const checkLogin = async (to, from, next) => {
  const userStore = useUserStore();
  const isLoggedIn = await userStore.checkLogin();
  console.log(isLoggedIn);
  if (isLoggedIn) {
    next();
  } else {
    next("/login");
  }
};

// Routes Configuration
const routes = [
  {
    path: "/",
    component: Main,
    children: [
      {
        path: "",
        name: "Portfolio",
        component: Main,
      },
      {
        path: "portfolio/list/:userIdx",
        name: "UserPortfolioList",
        components: {
          default: Main,
          user: UserPort,
        },
      },
      {
        path: "/bookmarks",
        name: "BookmarkedPortfolios",
        component: Main, // 기존 Main 컴포넌트 재사용
        props: { showBookmarks: true }, // 북마크 필터링에 필요한 값 전달
      },
    ],
  },
  
  {
    path: '/portfolio/:mode', // mode: create 또는 update
    name: 'Portfolio',
    component: CreatePortfolio,
    props: true, // mode를 props로 전달
  },
  { path: "/portfolio/detail/:idx", component: PortfolioDetail },
  { path: "/stock/:idx", component: StockDetail },
  { path: "/stockList", component: StockList},
  // { path: '/editport', component: CreatePortfolio, beforeEnter: checkLogin }, //로그인 되었는지 확인
  { path: '/signup', component: Signup },
  { path: '/endsignup', component: EndSignup},
  { path: "/login", component: Login },
  {
    path: "/:pathMatch(.*)*", // 기타 존재하지 않는 페이지인 경우
    redirect: "/404",
  },
  { path: "/404", component: Error404 },
  { path: "/mylikes", component: StockLikesList },
  { path: "/about", component: About },
  { path: "/privacy", component: Privacy },
  { path: "/myprofile", component: Profile },
  { path: "/settings", component: EditProfile },
];

// Router Instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
