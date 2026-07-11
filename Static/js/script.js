// Filter button toggles
document.querySelectorAll('aside button').forEach(btn => {
    btn.addEventListener('click', function() {
        const parentGroup = this.parentElement;
        parentGroup.querySelectorAll('button').forEach(b => {
            b.classList.remove('bg-[#FFDD00]');
            b.classList.add('bg-white');
        });

        this.classList.remove('bg-white');
        this.classList.add('bg-[#FFDD00]');
        });
});

//form button toggle

const buttonGroups = document.querySelectorAll(".button-group");

buttonGroups.forEach((group) => {
    const buttons = group.querySelectorAll(".toggle-button");

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            buttons.forEach((item) => {
                item.classList.remove("bg-[#FFDD00]");
                item.classList.add("bg-white");
            });

            button.classList.remove("bg-white");
            button.classList.add("bg-[#FFDD00]");
        });
    });
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
