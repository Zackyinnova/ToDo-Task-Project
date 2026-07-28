async function loadChart() {
  const response = await fetch("/api/chart/weekly");
  const data = await response.json();
  renderChart(data.labels, data.totals, data.completed);
}

function renderChart(labels, totals, completed) {

  const remaining = totals.map((t, i) => Math.max(0, t - completed[i]));

  // Alternate yellow / black fill per day, gray out days with no tasks at all
  const fillColors = totals.map((t, i) => {
    if (t === 0) return "#d9d9d9";
    return i % 2 === 0 ? "#f6c400" : "#111111";
  });

  const borderColors = totals.map((t) => (t === 0 ? "#9a9a9a" : "#111111"));

  const ctx = document.getElementById("taskChart");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels.map(l => l.slice(0, 3).toUpperCase()),
      datasets: [
        {
          label: "Completed",
          data: completed,
          backgroundColor: fillColors,
          borderColor: borderColors,
          borderWidth: 3,
          borderRadius: 6,
          borderSkipped: false,
          stack: "tasks"
        },
        {
          label: "Remaining",
          data: remaining,
          backgroundColor: "#f0e9db",
          borderColor: borderColors,
          borderWidth: 3,
          borderRadius: 6,
          borderSkipped: false,
          stack: "tasks",
          datalabels: {
            anchor: "end",
            align: "end",
            offset: 8,
            formatter: (value, ctx) => totals[ctx.dataIndex],
            font: { weight: "bold", family: "Courier New" },
            color: (ctx) => (totals[ctx.dataIndex] === 0 ? "#9a9a9a" : "#111111")
          }
        }
      ]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { right: 30 } },
      scales: {
        x: {
          stacked: true,
          display: false,
          grid: { display: false }
        },
        y: {
          stacked: true,
          grid: { display: false },
          border: { display: false },
          ticks: { font: { weight: "bold", family: "Courier New" }, color: "#111111" }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.dataset.label}: ${ctx.raw}`
          }
        },
        datalabels: { display: false }
      }
    },
    plugins: [ChartDataLabels]
  });
}

loadChart();