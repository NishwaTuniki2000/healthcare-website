// BloodPressureChart.js
import Chart from 'chart.js/auto';

export const drawBloodPressureChart = (systolicData, diastolicData, labels) => {
  // Get the chart element from HTML
  const ctx = document.getElementById('bloodPressureChart')?.getContext('2d');

  // Check if the chart element is found
  if (!ctx) {
    console.error('Blood pressure chart element not found');
    return;
  }

  // Clean up previous charts to prevent overlap
  if (window.bloodPressureChartInstance) {
    window.bloodPressureChartInstance.destroy();
  }

  // Create a new chart instance
  window.bloodPressureChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Systolic (mmHg)',
          data: systolicData,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: true,
        },
        {
          label: 'Diastolic (mmHg)',
          data: diastolicData,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Month & Year',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Blood Pressure (mmHg)',
          },
          beginAtZero: true,
        },
      },
    },
  });
};
