document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.role === "owner") {
        document.getElementById("users-menu")?.classList.remove("hidden");
    }
});
