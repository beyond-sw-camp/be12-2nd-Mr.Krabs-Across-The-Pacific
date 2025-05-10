<script setup>
import { onMounted, ref, reactive } from "vue";
import { useUserStore } from "../stores/useUserStore.js";
import { useStockLikesStore } from "../stores/useStockLikesStore.js";
import { useRoute } from "vue-router";

const userStore = useUserStore();
// 프로파일에 사용할 변수들
let image = ref("");
let name = ref("장원영");
let email = ref("example1@gmail.com");
let created = ref("2025-01-01");
let tier = ref("Bronze");
let portnum = ref(0);
let portlikes = ref(0);
let stocklikes = ref(0);
let follower = ref(0);
let following = ref(0);

image.value = userStore.image === "" ? "../images/badge3.webp" : userStore.image;

let stockLikesList = reactive({});

const stockLikesStore = useStockLikesStore();
const route = useRoute();

const myPortUrl = ref(`/portfolio/list/${userStore.$state.userId}`);

//stocklikes.value = stockLikesStore.stockListTotalLength;

onMounted(async () => {
  const response = await userStore.getUserDetail();
  name.value = response.name
  email.value = response.email
  tier.value = response.tier;
  portnum.value = response.portfolio_count;
  follower.value = response.followers_count;
  following.value = response.followings_count;
  image.value = response.image === "" ? "/images/across_the_pacific.PNG" : response.image;
});
</script>
<template>
  <div id="userprofile">
    <div>내 정보</div>
    <div id="userimage"><img :src="image" width="256" height="256" /></div>
    <div id="username">이름: {{ name }}</div>
    <div id="useremail">이메일: {{ email }}</div>
    <div id="usercreated">가입 일자: {{ created }}</div>
    <div id="usertier">유저 등급: {{ tier }}</div>
    <div id="userportfolio">
      나의 포트폴리오 수: <router-link :to=myPortUrl>{{ portnum }}</router-link>
    </div>
    <div id="userlikes-port">
      나의 포트폴리오 좋아요 수: <router-link to="/bookmarks">{{ portlikes }}</router-link>
    </div>
    <div id="userlikes-stock">
      나의 관심 주식 수: <router-link to="/mylikes" :initialList="stockLikesList">{{ stocklikes }}</router-link>
    </div>
    <div id="userlikes-port">
      내가 팔로우한 사용자 수: {{ following }}
    </div>
    <div id="userlikes-stock">
      나를 팔로우하는 사람 수: {{ follower }}
    </div>
  </div>
  <div style="text-align: center; margin: 1rem">
    <router-link to="/settings"><button class="modifyprofile">정보 수정</button></router-link>
    <br /><br />
    <button class="danger">회원 탈퇴</button>
  </div>
</template>
<style scoped>
#userprofile {
  text-align: center;
  padding: 8rem;
}

.modifyprofile {
  background-color: #4f74df;
  color: white;
  border-radius: 0.4rem;
}

.danger {
  background-color: red;
  color: white;
  border-radius: 0.4rem;
  border: 1px none;
}
</style>
