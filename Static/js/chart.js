async function loadChart() {
  const response = await fetch("/api/chart/weekly");
  const data = await response.json();
  renderChart(data.labels, data.totals, data.completed);
}

function renderChart(labels, totals, completed) {

  const remaining = totals.map((t, i) => Math.max(0, t - completed[i]));

  // Convert to percentages so every row spans the full track width,
  // regardless of how many tasks that day actually has.
  const completedPct = totals.map((t, i) => (t > 0 ? (completed[i] / t) * 100 : 0));
  const remainingPct = totals.map((t, i) => (t > 0 ? (remaining[i] / t) * 100 : 100));

  // Alternate yellow / black fill per day, gray out days with no tasks at all
  const fillColors = totals.map((t, i) => {
    if (t === 0) return "#d9d9d9";
    return i % 2 === 0 ? "#f6c400" : "#111111";
  });

  const borderColors = totals.map((t) => (t === 0 ? "#9a9a9a" : "#111111"));

  // Border only on the OUTER edges of the combined bar.
  // The edge where completed meets remaining gets no border, so the two
  // segments read as one continuous track instead of two separate boxes.
  function completedBorderWidth(ctx) {
    const i = ctx.dataIndex;
    const isFull = remaining[i] === 0; // completed fills the whole bar
    return { top: 3, bottom: 3, left: 3, right: isFull ? 3 : 0 };
  }

  function remainingBorderWidth(ctx) {
    const i = ctx.dataIndex;
    const isEmpty = completed[i] === 0; // nothing completed, remaining fills whole bar
    return { top: 3, bottom: 3, right: 3, left: isEmpty ? 3 : 0 };
  }

  // Rounded corners only on the outer ends of the bar; square where the two
  // segments touch, so the border radius reads as one pill shape.
  function completedBorderRadius(ctx) {
    const i = ctx.dataIndex;
    const isFull = remaining[i] === 0;
    return {
      topLeft: 6,
      bottomLeft: 6,
      topRight: isFull ? 6 : 0,
      bottomRight: isFull ? 6 : 0
    };
  }

  function remainingBorderRadius(ctx) {
    const i = ctx.dataIndex;
    const isEmpty = completed[i] === 0;
    return {
      topRight: 6,
      bottomRight: 6,
      topLeft: isEmpty ? 6 : 0,
      bottomLeft: isEmpty ? 6 : 0
    };
  }

  const ctx = document.getElementById("taskChart");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels.map(l => l.slice(0, 3).toUpperCase()),
      datasets: [
        {
          label: "Completed",
          data: completedPct,
          backgroundColor: fillColors,
          borderColor: borderColors,
          borderWidth: completedBorderWidth,
          borderRadius: completedBorderRadius,
          borderSkipped: false,
          stack: "tasks"
        },
        {
          label: "Remaining",
          data: remainingPct,
          backgroundColor: "#f0e9db",
          borderColor: borderColors,
          borderWidth: remainingBorderWidth,
          borderRadius: remainingBorderRadius,
          borderSkipped: false,
          stack: "tasks",
          datalabels: {
            display: true,
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
          min: 0,
          max: 100,
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
            label: (ctx) => {
              const i = ctx.dataIndex;
              const value = ctx.datasetIndex === 0 ? completed[i] : remaining[i];
              return `${ctx.dataset.label}: ${value}`;
            }
          }
        },
        datalabels: { display: false }
      }
    },
    plugins: [ChartDataLabels]
  });
}

loadChart();

async function loadStreak() {
  const response = await fetch("/api/chart/weekly");
  const data = await response.json();
 
 
  document.querySelectorAll("[data-day]").forEach((dayEl) => {
    const i = parseInt(dayEl.dataset.day, 10);
    const completedCount = data.completed[i] || 0;
    const isDone = completedCount > 0;
 
    const box = dayEl.querySelector(".streak-box");
    const icon = dayEl.querySelector(".streak-icon");
 
    if (isDone) {
      // Done: solid black box + checkmark icon
      box.classList.remove("bg-white", "border-2", "border-gray-300");
      box.classList.add("bg-black");
      icon.classList.remove("hidden");
    } else {
      // Not done: plain empty box, no icon
      box.classList.remove("bg-black");
      box.classList.add("bg-white", "border-2", "border-gray-300");
      icon.classList.add("hidden");
    }
  });
}
 
loadStreak();