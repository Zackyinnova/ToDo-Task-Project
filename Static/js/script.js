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

// Category
const categoryButtons = document.querySelectorAll(".category-button");
const categoryInput = document.getElementById("category");

categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        categoryInput.value = button.dataset.value;
    });
});

// Priority
const priorityButtons = document.querySelectorAll(".priority-button");
const priorityInput = document.getElementById("priority");

priorityButtons.forEach(button => {
    button.addEventListener("click", () => {
        priorityInput.value = button.dataset.value;
    });
});

let currentCategory = "all";
let currentPriority = "all";

function filterTask() {

    const tasks = document.querySelectorAll(".task-list");

    tasks.forEach(task => {

        console.log({
            filterCategory: currentCategory,
            taskCategory: task.dataset.category,
            filterPriority: currentPriority,
            taskPriority: task.dataset.priority
        });

        const taskCategory = task.dataset.category.toLowerCase();
        const taskPriority = task.dataset.priority.toLowerCase();

        const matchCategory =
            currentCategory === "all" ||
            taskCategory === currentCategory;

        const matchPriority =
            currentPriority === "all" ||
            taskPriority === currentPriority;

        if (matchCategory && matchPriority) {
            task.style.display = "";
        } else {
            task.style.display = "none";
        }

    });

}


// ================= CATEGORY =================

document.querySelectorAll(".filter-category").forEach(button => {

    button.addEventListener("click", () => {

        currentCategory = button.dataset.category.toLowerCase();

        filterTask();

    });

});


// ================= PRIORITY =================

document.querySelectorAll(".filter-priority").forEach(button => {

    button.addEventListener("click", () => {

        currentPriority = button.dataset.priority.toLowerCase();

        filterTask();

    });

});