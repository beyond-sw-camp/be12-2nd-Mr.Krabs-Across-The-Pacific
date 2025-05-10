import { defineStore } from "pinia";
import axios from "axios";

export const usePortfolioDetailStore = defineStore("portfolioDetail", {
  state: () => ({
    result:{
      idx:'',
      name:'',
      acquisitionList:[],
    },
  stockgraphList: []
  }),
  actions: {
    async getPortfolioDetail(idx) {
      try {
        const response = await axios.get(`/api/portfolio/${idx}`);
        if(response.data?.result){
          this.result = response.data.result;
          console.log("포트폴리오 정보 : ", this.result);
          return this.result;
        }else{
          throw new Error("잘못된 응답 형식입니다.");
        }
      } catch (error) {
        console.error("Error fetching portfolio details:", error);
      }
    },
    async getRecentPrice(code) {
      try {
        const response = await axios.get(`/api/stock/recent/${code}`);
        this.stockgraphList = response.data.result;
        return response.data.result;
      } catch (error) {
        console.error("Error fetching portfolio details:", error);
      }
    },
    async getPriceList(code) {
      try {
        const response = await axios.get(`/api/stockgraph/${code}` );
        return response.data.result;
      } catch (error) {
        console.error("Error fetching portfolio details:", error);
      }
    },

    //포트폴리오 클릭시 조회수 증가
    async getPortfolioViewCnt(idx) {
      try {
        await axios.get(`/api/portfolio/view/${idx}`);

      } catch (error) {
        console.error("Error fetching portfolio details:", error);
      }
    },
    async setportfolioDetail(idx) {
      // Implementation for creating a new portfolio detail
    },

    async updateportfolioDetail(idx) {
      // Implementation for updating an existing portfolio detail
    },

  },
});
