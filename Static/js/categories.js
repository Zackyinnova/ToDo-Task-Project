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


