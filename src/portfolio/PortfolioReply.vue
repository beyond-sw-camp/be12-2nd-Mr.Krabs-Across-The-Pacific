<script setup>
import { defineProps, ref, onMounted } from 'vue';
import { useUserStore } from '../stores/useUserStore';
import { usePortfolioRepliesStore } from '../stores/usePortfolioRepliesStore';
import { useRoute } from 'vue-router';
const props = defineProps({
  reply: {
    type: Object,
    required: true,
  },
});
const routes = useRoute();
const userStore = useUserStore();
const portfolioRepliesStore = usePortfolioRepliesStore();
const isUpdate = ref(false);
const isLiked = ref(props.reply?.isLiked || false);
const likesCount = ref(props.reply?.likesCount || 0);
const heartsContainer = ref(null); // 하트 컨테이너 참조


const changeUpdate = () => {
  isUpdate.value = !isUpdate.value;
}

const updateReply = async (replyId) => {
  const content = document.querySelector('#comment' + replyId).innerHTML;
  const result = await portfolioRepliesStore.updatePortfolioReply(replyId, content);
  router.go(0);
}

const likeReply = async (replyId) => {
  //로그인 안했으면 못누른다.
  if (userStore.userId == null) return;

  //withcredential이용으로 일단 막아둠
  //await stockReplyStore.setReplyLikes(replyId);
  isLiked.value = true;
  likesCount.value = likesCount.value + 1;
  const heart = document.createElement('div');
  heart.textContent = '♥️'; // 하트 모양
  heart.classList.add('flying-heart');
  heartsContainer.value.appendChild(heart);
}
const dislikeReply = async (replyId) => {
  //await stockReplyStore.deleteReplyLikes(replyId);a
  isLiked.value = false;
  likesCount.value = likesCount.value - 1;
}


</script>

<template>
  <div>
    <div class="card-row card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">{{ reply.userName }}</h6>
        <div v-if="userStore.userId == reply.userId">
          <div class="dropdown no-arrow">
            <a class="dropdown-toggle nav-link " href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <font-awesome-icon :icon="['fas', 'ellipsis-vertical']" />

            </a>
            <ul class="dropdown-menu">
              <li>
                <a class="dropdown-item" @click="changeUpdate">수정</a>
                <a class="dropdown-item" @click="deleteReply(reply.replyId)">삭제</a>
              </li>
            </ul>
          </div>
        </div>

        <small class="replycard-info text-black-50">
          작성일자: {{ reply.createdAt }}
        </small>
        <small v-if="reply.createdAt != reply.updatedAt" class="text-right replycard-info text-black-50">
          (수정됨)
        </small>

        <div>
          <div style="display: flex; align-items: center;" class="me-auto align-items-lg-center">
            <button class="like-btn ">
              <font-awesome-icon class="like-icon" v-if="isLiked" @click="dislikeReply(reply.id)"
                :icon="['fas', 'heart']" />
              <font-awesome-icon class="like-icon" v-else @click="likeReply(reply.id)" :icon="['far', 'heart']" />
              <div class="hearts-container" ref="heartsContainer"></div>
            </button>
            <p style="margin-left: 5px;">{{ reply.likesCount }}</p>
          </div>

        </div>
      </div>
      <div class="card-body">
        <p>{{ reply.contents }}</p>
      </div>
    </div>
  </div>
</template>
<style scoped>
@import '../common/sb-admin-2.min.css';
@import 'https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i';

.card-row {
  flex-direction: row;
}

.container-fluid {
  margin-top: 10vmax;
}

.border {
  border: 1px;
  border-width: 2px;
  padding: 2px;
  /* border-radius: 1.5rem; */
  overflow: hidden;
  /* border-radius 영역을 넘어가는 콘텐츠를 숨김 */

}

.btn-border {
  border: 10px;
  border-color: black;
  background-color: #F0F0F0;
  border-radius: 0.5rem;
}

.container-btn {
  display: flex;
  flex-direction: row-reverse;
  justify-content: space-between;
}

.comment-btn {
  margin-left: auto;
  border-radius: 8px;
  background-color: #4f74df;
  border: 1px solid #bbb;
}

@media (max-width:992px) {
  .container-fluid {
    margin-top: 20vh;
  }
}
</style>
