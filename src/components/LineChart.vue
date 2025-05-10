<script setup>
// 경윤: 이 모듈은 아직 완벽하게 작동하지 않습니다.
import { Line } from "vue-chartjs";
import { defineProps, computed, ref, shallowRef, shallowReactive, reactive, onMounted } from "vue";
import axios from "axios";

import { Chart as ChartJS, Title, Tooltip, Legend, PointElement, CategoryScale, LinearScale, LineElement } from "chart.js";
import { useLoadingStore } from "../stores/useLoadingStore.js";

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

const props = defineProps({
  id: Number,
  code: String
});

let id = props.id ? props.id : 0;
let code = props.code ? props.code : "AAPL";

let labelList = reactive([]);
let dataList = reactive([]);

const loadingStore = useLoadingStore();

const chartData = computed(() => {
  return {
    labels: labelList,
    datasets: [
      {
        label: "",
        data: dataList,
        pointStyle: false,
        tension: 0,
        padding: 0,
      },
    ],
  };
});

const chartOptions = ref({
  responsive: true,
  plugins: {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,
    },
    aspectRatio: 8,
  },
});

onMounted(async () => {
  // 차트 데이터 가져오기
  try {
    const response = await axios.get(`/api/stockgraph/${code}`);
    const result = response.data.result;
    // console.log(result);
    const result_data = result.prices;
    const result_label = result.dates;
    const length = result_label.length;
    // 적용하기
    let chart = ChartJS.getChart(document.getElementsByClassName("graphchart")[id - 1]);
    for (let i = 0; i < length; i++) {
      labelList.push(result_label[i]);
    }
    chart.data.datasets[0].data = result_data;
    chart.update();
  } catch (e) {
    console.log("Cannot get graph: " + e.message);
  }
});
</script>
<template>
  <div class="chart" style="position: relative; width: 50vw; vertical-align: center;">
    <Line class="graphchart" ref="linechart" :data="chartData" :options="chartOptions" :width="800" :height="160" />
  </div>
</template>
<style scoped></style>
