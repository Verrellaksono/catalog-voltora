import { getCurrentUser } from "./utils/auth.js";
import { openModal, closeModal } from "./utils/modal.js";

document.addEventListener("DOMContentLoaded", () => {
    fetchTableCategories();
    initAddModalEvents();
    initDeleteModalEvents();
    initEditModalEvents();
});

function initAddModalEvents() {
    // Get Elements
    const modal = document.getElementById("category-modal");
    const form = document.getElementById("categoryForm");
    const openBtn = document.getElementById("openModalBtn");
    const closeBtn = document.getElementById("closeModalBtn");

    // Validasi Element
    if (!modal || !form) return;

    // Buka Modal
    openBtn.addEventListener("click", () => {
        openModal(modal);
    });

    // Tutup Modal lewat Tombol Silang
    closeBtn.addEventListener("click", () => {
        closeModal(modal, form);
    });

    // Tutup Modal jika area luar kotak dialog diklik
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal(modal, form);
        }
    });

    // Submit Form Add Category
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Variable
        const categoryName = document.getElementById("categoryName").value;
        const user = getCurrentUser();

        // Check User
        if (!user) {
            alertMessage("Silakan login terlebih dahulu", "danger");
            window.location.href = "/login";
            return;
        }

        // Validasi Name Category
        if (!categoryName.trim()) {
            alertMessage("Nama kategori tidak boleh kosong", "danger");
            return;
        }

        try {
            // Send Request
            const response = await fetch("/api/categories", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    user_id: user.id,
                },
                body: JSON.stringify({
                    name: categoryName,
                }),
            });
            const data = await response.json();

            if (response.status === 401 || response.status === 403) {
                alertMessage(data.message);
                localStorage.removeItem("user");
                window.location.href = "/login";
                return;
            }

            if (response.ok) {
                // Alert
                alertMessage(data.message, "success");
                // Close Modal
                closeModal(modal, form);
                // Reload Table
                fetchTableCategories();
            } else {
                // Alert
                alertMessage(data.message, "danger");
            }
        } catch (error) {
            console.error("Error submit kategori:", error);
            // Alert
            alertMessage(
                "Terjadi kesalahan sistem saat mencoba menyimpan data.",
                "danger",
            );
            // Close Modal
            closeModal(modal, form);
        }
    });
}

function initDeleteModalEvents() {
    const modal = document.getElementById("delete-confirm-modal");
    const deleteBtn = document.getElementById("deleteBtn");
    const cancelBtn = document.getElementById("cancelDeleteBtn");

    if (!modal || !deleteBtn || !cancelBtn) return;

    // Cancel
    cancelBtn.addEventListener("click", () => {
        deleteBtn.removeAttribute("data-category-id");
        closeModal(modal);
    });

    deleteBtn.addEventListener("click", async () => {
        console.log("Sudah di sini");
        // Variable
        const categoryId = deleteBtn.getAttribute("data-category-id");
        const user = getCurrentUser();

        if (!categoryId) return;

        try {
            // Send Request
            const response = await fetch(`/api/categories/${categoryId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    user_id: user.id,
                },
            });
            const data = await response.json();

            if (response.status === 401 || response.status === 403) {
                alert(data.message);
                localStorage.removeItem("user");
                window.location.href = "/login";
                return;
            }

            // Close Modal
            closeModal(modal);

            // Response Ok
            if (response.ok) {
                // Alert
                alertMessage(data.message, "success");
                // Reload Table
                fetchTableCategories();
            } else {
                // Alert
                alertMessage("Gagal: " + data.message, "danger");
            }
        } catch (error) {
            console.error("Error saat menghapus kategori:", error);
            // Alert
            alertMessage(
                "Terjadi kesalahan sistem saat mencoba menghapus data.",
                "danger",
            );
            // Close Modal
            closeModal("delete-confirm-modal");
        } finally {
            deleteBtn.removeAttribute("data-category-id");
        }
    });
}

function initEditModalEvents() {
    // DOM Elements
    const modal = document.getElementById("edit-category-modal");
    const form = document.getElementById("editCategoryForm");
    const closeBtn = document.getElementById("closeEditModalBtn");

    // Validasi Element
    if (!modal || !closeBtn || !form) return;

    // Close Modal
    closeBtn.addEventListener("click", () => {
        closeModal(modal, form);
    });

    // Tutup Modal jika luar area diklik
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal(modal, form);
        }
    });

    // Submit Form Edit
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const categoryId = document.getElementById("editCategoryId").value;
        const categoryNameInput = document.getElementById("editCategoryName").value;
        const user = getCurrentUser();

        try {
            // Send Request
            const response = await fetch(`/api/categories/${categoryId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    user_id: user.id,
                },
                body: JSON.stringify({
                    id: parseInt(categoryId),
                    name: categoryNameInput,
                }),
            });
            const data = await response.json();

            if (response.status === 401 || response.status === 403) {
                alert(data.message);
                localStorage.removeItem("user");
                window.location.href = "/login";
                return;
            }

            // Tutup modal edit
            closeModal(modal, form);

            if (response.ok) {
                alertMessage(data.message, "success");
                form.reset();
                fetchTableCategories(); // Muat ulang isi tabel agar nama baru langsung kelihatan!
            } else {
                alertMessage("Gagal: " + data.message, "danger");
            }
        } catch (error) {
            console.error("Error saat update kategori:", error);
            alertMessage("Terjadi kesalahan sistem saat memperbarui data.", "danger");
            closeModal(modal, form);
        }
    });
}

async function fetchTableCategories() {
    const tableBody = document.getElementById("category-table-body");
    if (!tableBody) return;

    try {
        // Send Request
        const response = await fetch("/api/categories");
        const categories = await response.json();

        // No Data
        if (!response.ok || !Array.isArray(categories) || categories.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="3" class="px-6 py-10 text-center text-gray-500 font-medium bg-neutral-primary-soft">
                        Belum ada data kategori di database Voltora.
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = "";
        // Data Table
        categories.forEach((category) => {
            const row = document.createElement("tr");
            row.className =
                "bg-neutral-primary-soft border-b border-default hover:bg-neutral-secondary-medium transition-colors";

            row.innerHTML = `
                <td class="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    ${category.id}
                </td>
                
                <td class="px-6 py-4 text-body font-medium">
                    ${category.name}
                </td>
                
                <td class="px-6 py-4 text-right whitespace-nowrap">
                    <button 
                        id="edit-btn"
                        class="font-medium text-fg-brand hover:underline bg-transparent border-0 cursor-pointer p-0 mr-3">
                        Edit
                    </button>
                    <button id="delete-btn" data-category-id="" class="font-medium text-red-600 hover:underline bg-transparent border-0 cursor-pointer p-0">Delete</button>
                </td>
            `;

            const editBtn = row.querySelector("#edit-btn");
            const deleteBtn = row.querySelector("#delete-btn");

            editBtn.addEventListener("click", () => {
                handleEditCategory(category.id, category.name);
            });

            deleteBtn.addEventListener("click", () => {
                handleDeleteCategory(category.id, category.name);
            });

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Gagal memuat kategori:", error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="3" class="px-6 py-10 text-center text-red-500 font-medium bg-neutral-primary-soft">
                    Gagal terhubung ke server untuk mengambil data kategori.
                </td>
            </tr>
        `;
    }
}

function handleEditCategory(id, name) {
    document.getElementById("editCategoryId").value = id;
    document.getElementById("editCategoryName").value = name;
    const modal = document.getElementById("edit-category-modal");
    openModal(modal);
}

function handleDeleteCategory(id, name) {
    console.log("sampai sini??");
    const modal = document.getElementById("delete-confirm-modal");
    document.getElementById("deleteBtn").setAttribute("data-category-id", id);
    document.getElementById("delete-modal-text").innerHTML = `
        Apakah Anda yakin ingin menghapus kategori
        <br>
        <strong>"${name}"</strong>?
    `;

    // Open Modal
    openModal(modal);
}
