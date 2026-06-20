document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const logoutBtn = document.getElementById("logoutBtn");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value;

            try {
                const response = await fetch("/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: username,
                        password: password,
                    }),
                });
                const data = await response.json();
                console.log(data);

                if (response.ok) {
                    alertMessage(data.message, "success");
                    localStorage.setItem("user", JSON.stringify(data.user));
                    setTimeout(() => {
                        window.location.href = "/categories";
                    }, 1500);
                } else {
                    alertMessage(data.message, "error");
                }
            } catch (error) {
                console.error("Error saat login fetch:", error);
                alertMessage(
                    "Tidak dapat terhubung ke server backend.",
                    "error",
                );
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("user");
            window.location.href = "/login";
        });
    }
});
