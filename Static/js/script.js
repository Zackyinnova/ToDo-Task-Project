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