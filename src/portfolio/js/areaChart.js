import { Chart, registerables } from 'chart.js';

Chart.register(...registerables); // Chart.js 기본 구성 등록

// Number formatting function
function number_format(number, decimals, dec_point, thousands_sep) {
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

// Generate random data
function generateRandomData(count, min, max) {
  return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

// Initialize Area Chart
export const initializeAreaChart = (ctx, datalist) => {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: new Array(datalist.length).fill(""),
      datasets: [{
        label: "Earnings",
        tension: 0.01,
        backgroundColor: "rgba(78, 115, 223, 0.05)",
        borderColor: "rgba(78, 115, 223, 1)",
        pointStyle: null,
        pointRadius : 0,
        data: datalist, // 인수로 받은 값 리스트를 반환
      }],
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 25,
          top: 25,
          bottom: 0
        }
      },
      scales: {
        x: { // x축 설정
          type: 'category',
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            maxTicksLimit: 7
          }
        },
        y: { // y축 설정
          beginAtZero: false,
          min: -500, // 최소값 -50
          max: 500,  // 최대값 50
          grid: {
            color: "rgb(234, 236, 244)",
            zeroLineColor: "rgb(234, 236, 244)",
            drawBorder: false,
            borderDash: [2],
            zeroLineBorderDash: [2]
          },
          ticks: {
            stepSize: 10, // y축 간격
            callback: function(value) {
              return number_format(value) + '%';
            }
          }
        },
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              label += number_format(context.raw) + '%';
              return label;
            }
          }
        }
      }
    }
  });
};
