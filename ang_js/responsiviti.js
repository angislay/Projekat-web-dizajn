// Hamburger meni — radi na svim stranicama
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger_dugme");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("otvoren");
        });

        // Zatvori meni kad kliknes na link
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("otvoren");
            });
        });
    }
});