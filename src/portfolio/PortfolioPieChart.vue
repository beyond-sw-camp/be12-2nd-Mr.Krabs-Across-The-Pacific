<script setup>

import { ref, onMounted, defineProps, computed, watch } from 'vue';
import { initializePieChart } from './js/pieChart.js'; // 모듈 가져오기
import { useRoute } from 'vue-router';
import { usePortfolioDetailStore } from '../stores/usePortfolioDetailStore.js';

const props = defineProps({
  portfolioStocks: Object,
  profit: String
})
/*
// Props로 portfolioStocks 데이터를 받습니다.
const props = defineProps({
  portfolioStocks: {
    type: Array,
    required: true,
  },
});
*/
const chartRef = ref(null);
const route = useRoute();
const portfolioDetailStore = usePortfolioDetailStore();
let portfolioStocks = ref([]);
let total_profit = ref(0);

onMounted(async () => {
  const response = await portfolioDetailStore.getPortfolioDetail(route.params.idx);
  portfolioStocks.value = response.topStocks;
  if (chartRef.value) {
    const ctx = chartRef.value.getContext('2d');
    initializePieChart(ctx, portfolioStocks.value); // Chart 초기화 함수 호출
  }
});
let chartInstance = null;

// 차트 렌더링
const renderChart = () => {
  if (chartRef.value && props.portfolioStocks.length > 0) {
    const ctx = chartRef.value.getContext('2d');
    // 기존 차트가 있으면 제거 (중복 생성 방지)
    if (chartInstance) {
      chartInstance.destroy();
    }
    // 새 차트 생성
    chartInstance = initializePieChart(ctx, props.portfolioStocks);
  }
};

// 1️. 마운트될 때 실행 (초기 데이터가 있으면 바로 그림)
onMounted(() => {
  renderChart();
});

// 2️. `portfolioStocks` 데이터가 변경될 때 즉시 차트 업데이트
watch(() => props.portfolioStocks, (newVal) => {
  if (newVal.length > 0) {
    renderChart();
  }
}, { deep: true, immediate: true });
</script>

<template>
  <div>
    <canvas ref="chartRef" style="max-width: 100%; max-height: 100%;"></canvas>
  </div>
</template>

<style scoped>
canvas {

  max-width: 100%;
  max-height: 100%;
}
</style>
