const colorInput = document.getElementById("color_categories");
const colorBoxes = document.querySelectorAll(".color-box");

colorBoxes.forEach(box => {

    box.addEventListener("click", () => {

        // reset semua box
        colorBoxes.forEach(item => {
            item.classList.remove(
                "-translate-x-[2px]",
                "-translate-y-[2px]"
            );
        });

        // aktifkan box yang dipilih
        box.classList.add(
            "-translate-x-[2px]",
            "-translate-y-[2px]"
        );

        colorInput.value = box.dataset.color;

    });

});

document.querySelectorAll(".category-color").forEach((item) => {
    item.style.backgroundColor = item.dataset.color;
});

const btnAddTask = document.getElementById("btn-addtask");
const overAddTask = document.getElementById("overlay-addtask");

btnAddTask.addEventListener("click", () =>{
    overAddTask.style.display = "flex";
});

overAddTask.addEventListener("click", (e) =>{
    if(e.target === overAddTask){
        overAddTask.style.display = "none";
    }
});


document.querySelectorAll(".category-button").forEach((btn) => {
    btn.style.backgroundColor = btn.dataset.bg;
    btn.style.color = btn.dataset.color;
});

//form button toggle

const buttonGroups = document.querySelectorAll(".button-group");

buttonGroups.forEach((group) => {
    const buttons = group.querySelectorAll(".toggle-button");

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            // Reset semua button dalam grup ini ke posisi normal
            buttons.forEach((item) => {
                item.classList.remove(
                    "-translate-x-[2px]",
                    "-translate-y-[2px]"
                );
            });

            // Highlight button yang barusan diklik
            button.classList.add(
                "-translate-x-[2px]",
                "-translate-y-[2px]"
            );
        });
    });
});

const monthButtons = document.querySelectorAll(".month-button");
const taskCards = document.querySelectorAll(".task-card");

function filterByMonth(month) {

    taskCards.forEach(card => {

        if (card.dataset.bulan === month) {
            card.style.display = "flex";
        } else {
            card.style.display = "none";
        }

    });

}

monthButtons.forEach(button => {

    button.addEventListener("click", () => {

        const selectedMonth = button.dataset.month;

        // Reset semua tombol
        monthButtons.forEach(btn => {
            btn.classList.remove("bg-black", "text-white");
            btn.classList.add("bg-[#FFDD00]");
        });

        // Tombol aktif
        button.classList.remove("bg-[#FFDD00]");
        button.classList.add("bg-black", "text-white");

        filterByMonth(selectedMonth);

    });

});

// Otomatis tampilkan bulan sekarang saat halaman dibuka
window.addEventListener("DOMContentLoaded", () => {

    const currentButton = document.querySelector(
        `[data-month="{{ current_idx }}"]`
    );

    if (currentButton) {
        currentButton.click();
    }

});