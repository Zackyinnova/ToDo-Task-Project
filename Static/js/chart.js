async function loadChart() {

    const response = await fetch("/api/chart/weekly");

    const data = await response.json();

    const ctx = document.getElementById("taskChart");

    new Chart(ctx, {

        type: "bar",

        data: {
            labels: data.labels,

            datasets: [{
                label: "Weekly Tasks",
                data: data.values
            }]
        },
        options: {
            indexAxis: 'y'
        }

    });

}

loadChart();