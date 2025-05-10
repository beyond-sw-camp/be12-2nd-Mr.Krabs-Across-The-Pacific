import { Chart, registerables } from "chart.js";

Chart.register(...registerables); // Chart.js 기본 구성 등록

//플러그인 커스텀
/*
const centerTextPlugin = {
  id: "centerText",
  beforeDraw(chart) {
    if (chart.config.type === "doughnut") {
      const { width, height, ctx } = chart;
      ctx.save();
      const fontSize = 24;
      ctx.font = `${fontSize}px Nunito`;
      ctx.textBaseline = "middle"; // 텍스트 세로 정렬 기준

      // 중앙에 표시할 텍스트

      //TODO: 추후 수익률 계산이 되면 수익률로 변경하기
      const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
      const text = `${total}%`;

      // 텍스트 중앙 좌표 계산
      const textX = Math.round((width - ctx.measureText(text).width) / 2);
      const textY = Math.round(height/2)+25; // 캔버스의 중앙 (라벨 높이에 따라 달라지는 것 고려)
      
      // 텍스트 그리기
      ctx.fillText(text, textX, textY);
      ctx.restore();
    }
  },
};

// 플러그인 등록
Chart.register(centerTextPlugin);
*/
// 차트 초기화
export const initializePieChart = (ctx, acquisitionList) => {
  const myPieChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: acquisitionList.map((value) => value.stockName.slice(0,10)),
      datasets: [
        {
          data: acquisitionList.map((value) => value.percentage),
          backgroundColor: [
            "#4e73df",
            "#1cc88a",
            "#36b9cc",
            "#E74A3B",
            "#F6C23E",
            "#A549E4",
          ],
          hoverBackgroundColor: ["#2e59d9", "#17a673", "#2c9faf", "#E7483B", "#F6B23D", "#4549E4"],
          hoverBorderColor: "rgba(234, 236, 244, 1)",
          borderWidth: 4, // 도넛의 외곽선 두께
        }
      ],
    },
    options: {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true, // 상단에 labels 표시
          position: "top", // 위치 설정 (top, bottom, left, right 중 선택)
          labels: {
            font: {
              family: "Nunito",
              size: 14,
            },
          },
        },
        tooltip: {
          enabled: true, // 마우스 오버 시 이름과 데이터 표시
          callbacks: {
            label(tooltipItem) {
              const label = tooltipItem.label || "";
              const value = tooltipItem.raw;
              return `${label}: ${value}`;
            },
          },
        },
      },
      cutout: "50%", // 도넛 중앙 크기
    },
  });

  return myPieChart;
};