<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import PortfolioReply from './PortfolioReply.vue';
import PortfolioStock from './PortfolioStock.vue';
import PortfolioPieChart from './PortfolioPieChart.vue';
import PortfolioAreaChart from './PortfolioAreaChart.vue';
import { usePortfolioDetailStore } from '../stores/usePortfolioDetailStore';
import { usePortfolioRepliesStore } from '../stores/usePortfolioRepliesStore';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/useUserStore';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const portfolioDetailStore = usePortfolioDetailStore();
const portfolioRepliesStore = usePortfolioRepliesStore();

const userStore = useUserStore();

const portfolioStocks = ref([]);
// const portfolioReplies = ref([]);

const portfolioDetail = ref({
  idx: '',
  name: '',
  own: '',
  profileImage: '',
  topStocks: []
})

const portfolioReplies = ref([]);
const page = ref(0); // 현재 페이지 번호
const size = 10; // 한 번에 불러올 개수


let portname = ref("");
let imagelink = ref("");
let prevAsset = ref(null);
let currAsset = ref(null);
let profit = ref(null);
let topstocks = ref([]);
let ratings = ref(0);
let viewers = ref(0);
onMounted(async () => {
  // Portfolio detail 데이터 가져오기
  await portfolioDetailStore.getPortfolioDetail(route.params.idx);
  await portfolioRepliesStore.getPortfolioRepliesByCreatedAt(route.params.idx);
  console.log("Portfolio Detail Loaded:", portfolioDetailStore.result);

  await axios.get(`/api/portfolio/view/${route.params.idx}`);


  // 계산해서 총 수익률 구하기
  prevAsset.value = portfolioDetailStore.result.acquisitionList.reduce((prev, curr) => {
    prev += curr.quantity * curr.price;
    return prev;
  }, 0);

  portfolioDetail.value.name = portfolioDetailStore.$state.result.name;
  portfolioDetail.value.topstocks = portfolioDetailStore.$state.result.topStocks;
  viewers.value = portfolioDetailStore.$state.result.viewCnt;

  Promise.all(portfolioDetailStore.result.acquisitionList
    .map((value) => [value.stockCode, value.price, value.quantity])
    .map(async ([code, price, quantity]) => {
      const recentprice = await portfolioDetailStore.getRecentPrice(code);
      return [recentprice * quantity, (price - recentprice) * quantity];
    })).then((response) => {
      currAsset.value = response.reduce((prev, curr) => prev + curr[0], 0).toFixed(2);
      profit.value = (portfolioDetailStore.$state.result.profit * 100 / currAsset.value).toFixed(2);
    });
  ratings.value = portfolioDetailStore.$state.result.ratings;

  // Portfolio replies 데이터 가져오기
  console.log("Portfolio Replies Loaded:", portfolioRepliesStore.portfolioReplies);
  // 데이터를 vue의 상태에 반영
  portfolioStocks.value = portfolioDetailStore.result.topStocks || {};
  portfolioReplies.value = portfolioRepliesStore.portfolioReplies || [];
});

const loadReplies = async $state => {
  try {
    const response = await portfolioRepliesStore.getPortfolioRepliesByCreatedAt(route.params.idx, page.value, size);
    if (response.length < 1) {
      console.log("더 이상 불러올 데이터 없음.");
      $state.complete();
    } else {
      portfolioReplies.value.push(...response);
      $state.loaded();
    }
    page.value++;
  } catch (error) {
    console.error("댓글 불러오기 실패:", error);
    $state.error();
  }
};

const newReplyContent = ref(""); // 새 댓글 내용
// 댓글 내용 업데이트 핸들러
const updateContent = (event) => {
  newReplyContent.value = event.target.innerText; // contenteditable의 텍스트 추출
};

const submitReply = async () => {
  if (!newReplyContent.value.trim()) {
    alert("댓글 내용을 입력해주세요.");
    return;
  }

  const newReply = {
    // username: "현재 사용자", // 사용자 이름
    content: newReplyContent.value,
    // createdAt: new Date().toISOString(), // 현재 시간
    // updatedAt: new Date().toISOString(),
  };

  try {
    await portfolioRepliesStore.setPortfolioReply(route.params.idx, newReply);
    newReplyContent.value = ""; // 댓글 입력창 초기화
    alert("댓글이 성공적으로 저장되었습니다.");
  } catch (error) {
    alert("댓글 저장 중 오류가 발생했습니다.");
  }
};

//const username = '멍자';
//const portfolioIdx = portfolioDetailStore.$state.result.idx;
const updateBtn = () => {
  router.push({
    path: '/editport',
    state: { username: "멍자", portfolioIdx: 1, portStatus: false },
  });
};

const deleteBtn = () => {
  const isConfirmed = confirm('정말로 삭제하시겠습니까?');
  if (isConfirmed) {
    //TODO
    router.push({ path: `/` });
  }
};

const goToUserInfo = async (userIdx, userName) => {
  router.push({
    name: "UserPortfolioList",
    params: { userIdx },
    query: { userName },
  });
};
</script>

<template>
  <div class="container">
    <div id="page-top">
      <div id="wrapper">
        <div id="content-wrapper" class="d-flex flex-column">
          <div id="content1">
            <!-- Begin Page Content -->
            <!-- 만약 페이지 구성 이상해지면  class="container-fluid1 를 class="container-fluid 로 변경-->
            <div class="container-fluid1">
              <!-- Page Heading -->
              <div class="d-sm-flex align-items-center justify-content-between mb-4">
                <!-- <router-link 
                  :to="userPortfolioRoute" 
                  @click="goToUserInfo(portfolioDetail.userIdx)">
                  <img alt="profile" fetchpriority="high" width="128" height="128" decoding="async" data-nimg="1"
                    style="color:transparent" :src="portfolioDetail.profileImage || '/images/멍자.png'"  />
                </router-link> -->
                <div>
                  <h1 class="h3 mb-0 text-gray-800">{{ portname }} 포트폴리오</h1>
                  <img @click="goToUserInfo(portfolioDetail.userIdx, portfolioDetail.userName)" alt="profile"
                    fetchpriority="high" width="128" height="128" decoding="async" data-nimg="1"
                    style="color:transparent" :src="portfolioDetail.profileImage || '/images/멍자.png'" />
                </div>
                <div>
                  <h1 class="h3 mb-0 text-gray-800">{{ portfolioDetail.name }}</h1>
                </div>
                <div>
                  <button v-if="portfolioDetail.own" class="updateBtn" @click="updateBtn">수정</button>
                  <button v-if="portfolioDetail.own" class="deleteBtn" @click="deleteBtn">삭제</button>
                </div>
              </div>
              <!-- Content Row -->
              <div class="row">
                <!-- Earnings (Monthly) Card Example -->
                <div class="col-xl-3 col-md-6 mb-4">
                  <div class="card border-left-primary shadow h-100 py-2">
                    <div class="card-body">
                      <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                          <div class="text-xs font-weight-bold text-primary text-uppercase mb-1">
                            STARTED WITH(투자 금액)</div>
                          <div class="h5 mb-0 font-weight-bold text-gray-800">${{ prevAsset }}</div>
                        </div>
                        <div class="col-auto">
                          <i class="fas fa-calendar fa-2x text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Earnings (Monthly) Card Example -->
                <div class="col-xl-3 col-md-6 mb-4">
                  <div class="card border-left-success shadow h-100 py-2">
                    <div class="card-body">
                      <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                          <div class="text-xs font-weight-bold text-success text-uppercase mb-1">
                            CURRENT ASSETS(현재 자산)</div>
                          <div class="h5 mb-0 font-weight-bold text-gray-800">${{ currAsset }}</div>
                        </div>
                        <div class="col-auto">
                          <i class="fas fa-dollar-sign fa-2x text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Earnings (Monthly) Card Example -->
                <div class="col-xl-3 col-md-6 mb-4">
                  <div class="card border-left-info shadow h-100 py-2">
                    <div class="card-body">
                      <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                          <div class="text-xs font-weight-bold text-info text-uppercase mb-1">PROFIT
                            RATE(수익률)
                          </div>
                          <div class="row no-gutters align-items-center">
                            <div class="col-auto">
                              <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">{{ profit }}%</div>
                            </div>
                            <div class="col">
                              <div class="progress progress-sm mr-2">
                                <div class="progress-bar bg-info" role="progressbar" style="width: 50%"
                                  aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-auto">
                          <i class="fas fa-clipboard-list fa-2x text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Pending Requests Card Example -->
                <div class="col-xl-3 col-md-6 mb-4">
                  <div class="card border-left-warning shadow h-100 py-2">
                    <div class="card-body">
                      <div class="row no-gutters align-items-center">
                        <div class="col mr-2">
                          <div class="text-xs font-weight-bold text-warning text-uppercase mb-1">
                            RATINGS(평가 순위)</div>
                          <div class="h5 mb-0 font-weight-bold text-gray-800">{{ ratings }}</div>
                        </div>
                        <div class="col-auto">
                          <i class="fas fa-comments fa-2x text-gray-300"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Content Row -->

              <div class="row">
                <!-- Pie Chart -->
                <div class="col-xl-8 col-lg-7">
                  <div class="card shadow mb-4">
                    <!-- Card Header - Dropdown -->
                    <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                      <h6 class="m-0 font-weight-bold text-primary">Revenue Sources</h6>
                      <div class="dropdown no-arrow">
                        <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown"
                          aria-haspopup="true" aria-expanded="false">
                          <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                          aria-labelledby="dropdownMenuLink">
                          <div class="dropdown-header">Dropdown Header:</div>
                          <a class="dropdown-item" href="#">Action</a>
                          <a class="dropdown-item" href="#">Another action</a>
                          <div class="dropdown-divider"></div>
                          <a class="dropdown-item" href="#">Something else here</a>
                        </div>
                      </div>
                    </div>
                    <!-- Card Body -->
                    <div class="card-body" style="white-space:pre-wrap; overflow-wrap: break-word;">
                      <PortfolioPieChart :portfolioStocks="portfolioDetail.topStocks" />
                    </div>
                  </div>
                </div>
                <!-- Portfolio 종목 Column (6/12) -->
                <div class="col-xl-4 col-lg-5">
                  <!-- 포트폴리오 종목 카드 -->
                  <div class="card shadow mb-4">
                    <div class="card-header py-3">
                      <!-- <PortfolioStock :portfolioStocks="portfolioDetailStore.portfolioItem.portfolio_Stocks" /> -->
                      <PortfolioStock :portfolioStocks="portfolioDetail.topStocks" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
      <!-- Content Row -->
      <div class="row">
        <!-- Area Chart -->
        <div class="col-xl-12 col-lg-12">
          <div class="card shadow mb-4">
            <!-- Card Header - Dropdown -->
            <div class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 class="m-0 font-weight-bold text-primary">Earnings Overview</h6>
              <div class="dropdown no-arrow">
                <a class="dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown"
                  aria-haspopup="true" aria-expanded="false">
                  <i class="fas fa-ellipsis-v fa-sm fa-fw text-gray-400"></i>
                </a>
                <div class="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                  aria-labelledby="dropdownMenuLink">
                  <div class="dropdown-header">Dropdown Header:</div>
                  <a class="dropdown-item" href="#">Action</a>
                  <a class="dropdown-item" href="#">Another action</a>
                  <div class="dropdown-divider"></div>
                  <a class="dropdown-item" href="#">Something else here</a>
                </div>
              </div>
            </div>
            <!-- Card Body -->
            <div class="card-body" style="white-space:pre-wrap; overflow-wrap: break-word;">
              <PortfolioAreaChart />
            </div>
          </div>
        </div>

      </div>

      <!-- Reply -->
      <div class="reply">
        <div class="compose-wrapper">
          <div class="avatar">
            <span class="user user--refresh">
              <!-- 아바타 -->
            </span>
          </div>
          <div class="textarea-outer-wrapper textarea-outer-wrapper--refresh">
            <div class="textarea-wrapper textarea-wrapper--embedv2" data-role="textarea" dir="auto">
              <div class="_container_ylcfx_1">
                <div class="_editor-container-expanded_ylcfx_37">
                  <!-- Placeholder -->
                  <div class="_placeholder_s9avi_1" v-if="!newReplyContent.trim()">댓글을 입력하세요</div>

                  <!-- Contenteditable div -->
                  <div role="textbox" aria-multiline="true" class="_editor-expanded_ylcfx_13 border" spellcheck="true"
                    data-slate-editor="true" data-slate-node="value" contenteditable="true" zindex="-1"
                    style="background-color: white; position: relative; white-space: pre-wrap; overflow-wrap: break-word;"
                    @input="updateContent"></div>
                </div>
                <div class="container-btn _toolbar_k0g7a_47">
                  <div class="_toolbar-primary_k0g7a_51">
                    <div class="_actions_k0g7a_78">
                      <button @click="submitReply"
                        class="comment-btn _button_8fv5d_1 _button-fill_8fv5d_15 _submit_k0g7a_84 bt" type="button">
                        <span class="_submit-text_k0g7a_122" style="color: white;">Comment</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="reply-section-title">댓글</div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <!-- Approach -->
          <PortfolioReply v-for="reply in portfolioReplies" :reply="reply" :key="reply.idx" />
          <!-- <InfiniteLoading @infinite="loadReplies"/> -->
          <InfiniteLoading @infinite="loadReplies">
            <template #complete>
              <div></div>
            </template>
          </InfiniteLoading>
        </div>

        <!-- /.container-fluid -->

      </div>
    </div>
    <!-- End of Main Content -->


  </div>

</template>



<style scoped>
@import '../common/sb-admin-2.min.css';
@import 'https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i';
@import './portfolioDetail.css'
</style>