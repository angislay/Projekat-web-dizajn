
function prikaziTab(tab) {
    document.querySelectorAll('.tab').forEach(el => {
        el.classList.remove('aktivan');
    });

    document.querySelector('.' + tab).classList.add('aktivan');
}