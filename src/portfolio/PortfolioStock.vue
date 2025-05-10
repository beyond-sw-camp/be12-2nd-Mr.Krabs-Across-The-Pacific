<script setup>
import { defineProps, onMounted, watch, ref, computed } from 'vue';
import { usePortfolioDetailStore } from '../stores/usePortfolioDetailStore';
import { useRoute } from 'vue-router';

const route = useRoute();
const portfolioDetailStore = usePortfolioDetailStore();

let portfolioStocks = ref([]);

onMounted(async () => {
  // Portfolio detail 데이터 가져오기
  await portfolioDetailStore.getPortfolioDetail(route.params.idx);
  portfolioStocks.value = portfolioDetailStore.result.topStocks;
});
</script>

<template>
  <div>
    <h6 class="m-0 font-weight-bold text-primary">Portfolio Stocks</h6>
    <ul class="list-group mt-3">
      <!-- portfolioStocks 배열을 순회하며 각 종목과 데이터를 표시 -->
      <li v-for="(stock, index) in portfolioStocks" :key="index"
        class="list-group-item d-flex justify-content-between align-items-center">
        <img :src="stock.image || '/images/멍자.png'" alt="Stock Image"
          style="width: 40px; height: 40px; margin-right: 10px;" />

        <span>{{ stock.stockName }}</span>
        <span class="ml-auto font-weight-bold">{{ stock.percentage }}%</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* 스타일링 */
.list-group-item {
  display: flex;
  align-items: center;
  padding: 10px;
}

img {
  border-radius: 50%;
}

.ml-auto {
  margin-left: auto;
}
</style>
