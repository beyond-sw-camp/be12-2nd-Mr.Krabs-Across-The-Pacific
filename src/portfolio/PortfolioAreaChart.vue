<script setup>
import { ref, reactive, onMounted } from 'vue';
import { initializeAreaChart } from '../portfolio/js/areaChart.js';
import { useRoute } from 'vue-router';
import { usePortfolioDetailStore } from '../stores/usePortfolioDetailStore.js';

const chartRef = ref(null);

const route = useRoute();
const portfolioDetailStore = usePortfolioDetailStore();
let graphvalues = ref([]);

onMounted(async () => {
  await portfolioDetailStore.getPortfolioDetail(route.params.idx);

  Promise.all(portfolioDetailStore.result.acquisitionList
    .map((value) => [value.stockCode, value.price, value.quantity])
    .map(async ([code, price, quantity]) => {
      const result = await portfolioDetailStore.getPriceList(code);
      const datelist = result.dates.reverse();
      const pricelist = result.prices.reverse();
      return [datelist, pricelist, price, quantity];
    })).then((reversedArray) => {
      graphvalues.value = reversedArray.map(([datelist, pricelist, price, quantity]) => {
        const reversedprofitlist = pricelist.map(value => (value - price) * quantity);
        return [datelist, reversedprofitlist];
      }).reduce((prev, curr) => {
        for (let i = 0; i < curr[1].length; i++) {
          prev[i] += curr[1][i];
        }
        return prev;
      }, new Array(730).fill(0)).reverse().filter((value) => value !== 0).map((value, index, array) => value / 100);
      if (chartRef.value) {
        const ctx = chartRef.value.getContext('2d');
        initializeAreaChart(ctx, graphvalues.value); // Chart 초기화
      }
    });
});
</script>

<template>
  <div class="chart-container">
    <canvas ref="chartRef"></canvas>
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 300px;
  /* 원하는 높이 설정 */
  position: relative;
  overflow: hidden;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>
