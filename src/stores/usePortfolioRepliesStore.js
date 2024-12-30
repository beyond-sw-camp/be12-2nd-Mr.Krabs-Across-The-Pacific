import { defineStore } from "pinia";
import axios from "axios";

export const usePortfolioRepliesStore = defineStore('portfolioReplies',{
    state: () => ({
        portfolioReplies: [
            {
                id: 1,
                userName: "JohnDoe",
                createdAt: "2024-10-03 09:30:00",
                updatedAt: "2024-10-03 10:00:00",
                content: "This portfolio looks great! How did you manage to achieve such high returns?",
                likesCount: 15,
            },
            {
                id: 2,
                userName: "JaneInvestor",
                createdAt: "2024-10-04 15:45:00",
                updatedAt: "2024-10-04 16:15:00",
                content: "Amazing portfolio selection. Any advice for beginners?",
                likesCount: 20,
            },
            {
                id: 3,
                userName: "StockGuru",
                createdAt: "2024-10-05 18:20:00",
                updatedAt: "2024-10-05 19:00:00",
                content: "Impressive gains! Did you account for recent market volatility?",
                likesCount: 10,
            },
        ],
        

    }),

    actions: {
        //포트폴리오id로 조회
        async getPortfolioRepliesByCreatedAt(idx) {
            const response = await axios.get(`https://a57d4fc0-b6d5-4291-b024-114538078baa.mock.pstmn.io/api/portfolio/${idx}/replies`);
            this.portfolioReplies = response.data; // 댓글 데이터
        },
        //입력한 댓글 저장 , idx == 포트폴리오 id(portfolioId)
        async setPortfolioReply(portfolioId, newReply) {  
            try {
            const response = await axios.post(
              `/api/portfolio/${portfolioId}/replies`,
              newReply
            );
            // 성공적으로 저장되면, 응답 데이터를 리스트에 추가
            this.portfolioReplies.push(response.data);
            console.log("댓글이 성공적으로 저장되었습니다:", response.data);
          } catch (error) {
            console.error("댓글 저장 중 에러 발생:", error);
            throw error; // 에러를 호출한 쪽으로 전달
          }
    

        },

        async updatePortfolioReply(idx) {

        }
    }, 
});
