function alertMessage(message, type) {
    const container = document.getElementById("alert-container");
    const alertMessage = document.getElementById("alert-message");

    if (!container || !alertMessage) return;

    alertMessage.textContent = message;
    container.className =
        "p-4 mb-4 text-sm rounded-base flex items-center gap-2 transition-all";

    const styles = {
        success: [
            "bg-green-50",
            "text-green-800",
            "border",
            "border-green-200",
        ],
        error: ["bg-red-50", "text-red-800", "border", "border-red-200"],
        warning: [
            "bg-yellow-50",
            "text-yellow-800",
            "border",
            "border-yellow-200",
        ],
        info: ["bg-blue-50", "text-blue-800", "border", "border-blue-200"],
    };

    container.classList.add(...(styles[type] || styles.info));

    container.classList.remove("hidden");

    setTimeout(() => {
        container.classList.add("hidden");
    }, 4000);
}
