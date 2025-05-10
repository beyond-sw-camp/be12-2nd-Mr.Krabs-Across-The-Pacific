import { defineStore } from "pinia";
import axios from "axios";

export const useStockListStore = defineStore("stockList", {
  state: () => ({
    offset: 0, // 페이지네이션 오프셋
    sortType: "ascending", // 정렬 기능 대비용 필드, 현재는 Mock 상태
    stockList: [],
    totalLength: 6969,
  }),
  persist: {
    storage: sessionStorage,
  },
  getters: {
    stockListResult: (state) => state.stockList,
    stockListOffset: (state) => state.offset,
    stockListLikes: (state) => state.stockList.map((value) => value.doILikeThis),
    stockListTotalLength: (state) => state.totalLength,
  },
  actions: {
    async getStockList(off) {
      // 전체 리스트를 반환
      try {
        const response = await axios.get("/api/stock/list");
        this.stockList = response.data.result.slice(off, off + 30);
        this.offset = off;
        this.totalLength = response.data.result.length;
        return response.data.result.slice(off, off + 30);
      } catch (e) {
        console.log(e.message);
        return this.stockList;
      }
    },
    //Note : KHJ
    async getStockListForSearch() {
      try {
        // TODO: 크롤링 서버 URL로 바꾸기
        //const response = await axios.get("/sample/stockList.json",);
        const response = await axios.get("/api/stock/list",);
        //return response.data;
        this.stockList = response.data.result;
        return response.data.result;
      } catch (e) {
        return this.stockList;
      }
    },
    getNextList() {
      // 다음 리스트로 페이지네이션을 위해 변경
      this.offset = this.offset + 30;
      return this.stockList.slice(this.offset, offset+30);
    },
    getPrevList() {
      // 이전 리스트로 페이지네이션을 위해 변경
      this.offset = this.offset - 30;
      return this.stockList.slice(this.offset, offset+30);
    },
    async setStockLikes(id) {
      // Note: 이 함수는 만약 종목 목록에서 직접 좋아요를 누를 경우를 대비해 만들었으며, 필요 없을 수도 있음
      try {
        // TODO: 진짜 서버 URL로 바꾸기
        const result = await axios.post("https://aaefca20-f361-4d2c-bc81-3db58a3ae355.mock.pstmn.io/stock", {
          params: {
            id: id,
            action: "like",
          },
        });
        if (result.status === 200) {
          this.stockList[id].likes += 1;
          return this.stockList[id].likes;
        } else {
          return this.stockList[id].likes;
        }
      } catch (e) {
        return this.stockList[id].likes; // 변경하지 않음
      }
    },
    async deleteStockLikes(id) {
      // Note: 이 함수는 만약 종목 목록에서 직접 좋아요를 해제할 경우를 대비해 만들었으며, 필요 없을 수도 있음
      try {
        // TODO: 진짜 서버 URL로 바꾸기
        const result = await axios.post("https://aaefca20-f361-4d2c-bc81-3db58a3ae355.mock.pstmn.io/stock", {
          params: {
            id: id,
            action: "dislike",
          },
        });
        if (result.status === 200) {
          this.stockList[id].likes -= 1;
          return this.stockList[id].likes;
        } else {
          return this.stockList[id].likes;
        }
      } catch (e) {
        return this.stockList[id].likes; // 변경하지 않음
      }
    },
    async getStockGraph(code) {
      try {
        // TODO: 진짜 서버 URL로 바꾸기
        const result = await axios.get(`/api/stockgraph/${code}`, {
        });
        if (result.status === 200) {
          return result.data.result;
        } else {
          return null;
        }
      } catch (e) {
        return null;
      }
    },
    async getRecentPrice(code) {
      try {
        // TODO: 진짜 서버 URL로 바꾸기
        const result = await axios.get(`/api/stock/recent/${code}`);
        if (result.status === 200) {
          return result.data.result;
        } else {
          return null;
        }
      } catch (e) {
        return null;
      }
    },
  },
});
