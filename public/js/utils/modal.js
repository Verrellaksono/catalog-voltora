function openModal(modal) {
    console.log("Sudah di modal");
    modal.classList.remove("hidden");
}

function closeModal(modal, form = null) {
    modal.classList.add("hidden");

    if (form) {
        form.reset();
    }
}

export {
    openModal,
    closeModal
}