import { defineStore } from "pinia";
import axios from "axios";

export const usePortfolioRepliesStore = defineStore('portfolioReplies',{
    state: () => ({
        result:{
        },
        portfolioReplies: [],
    }),

    actions: {
        //포트폴리오id로 조회
        async getPortfolioRepliesByCreatedAt(idx, page, size) {
            const response = await axios.get(`/api/portfolio/reply/${idx}`,{
                params: { page: page, size: size }
            });
            if(response.data?.result){
                this.result = response.data.result;
                return this.result.content;
            }else{
                throw new Error("잘못된 응답 형식입니다.");
            }
            // this.portfolioReplies = response.data.replies; // 댓글 데이터
        },
        //입력한 댓글 저장 , idx == 포트폴리오 id(portfolioId)
        async setPortfolioReply(portfolioId, newReply) {  
            try {
            const response = await axios.post(
              `/api/portfolio/reply/${portfolioId}`,
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

        async updatePortfolioReply(replyId, content) {
            const response = await axios
                .put("/sample/PortfolioReply/put.json", 
                    {
                        "replyId": replyId,
                        "content": content
                    },
                    { withCredentials: true }
                )  
                .catch((error)=> {
                    console.error(error);
                });
            return response.data;
            //axios
        },
    }, 
});
