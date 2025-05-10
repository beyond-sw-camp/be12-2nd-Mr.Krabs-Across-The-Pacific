<script setup>
import { defineProps, ref, reactive, onMounted, computed, onBeforeMount, watchEffect } from "vue";
import stockListItem from "./component/StockListItem.vue";
import { useStockListStore } from "../stores/useStockListStore.js";
import { useLoadingStore } from "../stores/useLoadingStore.js";
import { RouterLink, useRoute, useRouter } from "vue-router";

const loadingStore = useLoadingStore();
const stockListStore = useStockListStore();
const route = useRoute();
const router = useRouter();
let itemlist = ref([]);
let offset = ref(0);

const onMove = () => {
  if (loadingStore.isLoading) return;
  offset.value = offset.value + 30;
  stockListStore.$state.offset = offset.value + 30;
  loadStockList(offset.value + 30);
  watchEffect(loadStockList);
};


const loadStockList = (o) => {
  stockListStore.getStockList(o).then((result) => {
    console.log(offset.value);
    itemlist.value = result;
  });
};
loadStockList(offset.value);


</script>

<template>
  <div class="container">
    <h1>검색 결과</h1>
    <div :v-bind=itemlist v-for="item in itemlist">
      <stockListItem :information="item" />
    </div>
    <span class="pagination">
      <button @click="onMove">더보기</button>
    </span>
  </div>
</template>
<style scoped>
.container>h1 {
  margin-top: 6rem;
}

.pagination {
  text-align: center;
  justify-self: center;
}

.inverted-color {
  color: cornflowerblue;
}
</style>
