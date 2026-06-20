import { getCurrentUser } from "./utils/auth.js";
import { openModal, closeModal } from "./utils/modal.js";

document.addEventListener("DOMContentLoaded", () => {
    fetchTableUsers();
    initAddModalEvents();
    initDeleteModalEvents();
    initEditModalEvents();
});

function initAddModalEvents() {
    // DOM Elements
    const modal = document.getElementById("user-modal");
    const form = document.getElementById("userForm");
    const openBtn = document.getElementById("openModalBtn");
    const closeBtn = document.getElementById("closeModalBtn");

    // Validasi Modal & Form
    if (!modal || !form) return;

    // Open Modal
    openBtn.addEventListener("click", () => {
        openModal(modal);
    });

    // Close Modal
    closeBtn.addEventListener("click", () => {
        closeModal(modal, form);
    });

    // Close Modal when click outside
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal(modal, form);
        }
    });

    // Submit Form
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Get Form Data
        const username = document.getElementById("userName").value.trim();
        const email = document.getElementById("userEmail").value.trim();
        const password = document.getElementById("userPassword").value;
        const user = getCurrentUser();

        // Validasi User
        if (!user) {
            alertMessage("Silakan login terlebih dahulu", "danger");
            window.location.href = "/login";
            return;
        }

        // Validasi Form
        if (!username || !email || !password) {
            alertMessage("Harap lengkapi semua field wajib!", "danger");
            return;
        }

        try {
            // Send Request
            const response = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    user_id: user.id,
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });
            const data = await response.json();

            // Unauthorized
            if (response.status === 401 || response.status === 403) {
                alert(data.message);
                localStorage.removeItem("user");
                window.location.href = "/login";
                return;
            }

            // Response Ok
            if (response.ok) {
                alertMessage(data.message, "success");
                closeModal(modal, form);
                fetchTableUsers();
            } else {
                alertMessage(data.message, "danger");
            }
        } catch (error) {
            console.error("Error submit user:", error);
            alertMessage(
                "Terjadi kesalahan sistem saat mencoba menyimpan data.",
                "danger",
            );
            closeModal(modal, form);
        }
    });
}

function initEditModalEvents() {
    const modal = document.getElementById("edit-user-modal");
    const form = document.getElementById("editUserForm");
    const closeBtn = document.getElementById("closeEditModalBtn");

    if (!modal || !closeBtn || !form) return;

    closeBtn.addEventListener("click", () => {
        closeModal(modal, form);
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeModal(modal, form);
        }
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const userId = document.getElementById("editUserId").value;
        const username = document.getElementById("editUserName").value.trim();
        const email = document.getElementById("editUserEmail").value.trim();
        const password = document.getElementById("editUserPassword").value;
        const status = document.getElementById("editUserStatus").value;
        const user = getCurrentUser();

        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    user_id: user.id,
                },
                body: JSON.stringify({
                    id: parseInt(userId),
                    username,
                    email,
                    password: password || undefined, // send undefined if empty
                    status,
                }),
            });
            const data = await response.json();

            if (response.status === 401 || response.status === 403) {
                alert(data.message);
                localStorage.removeItem("user");
                window.location.href = "/login";
                return;
            }

            closeModal(modal, form);

            if (response.ok) {
                alertMessage(data.message, "success");
                form.reset();
                fetchTableUsers();
            } else {
                alertMessage("Gagal: " + data.message, "danger");
            }
        } catch (error) {
            console.error("Error saat update user:", error);
            alertMessage("Terjadi kesalahan sistem saat memperbarui data.", "danger");
            closeModal(modal, form);
        }
    });
}

function initDeleteModalEvents() {
    // Dom Elements
    const modal = document.getElementById("delete-confirm-modal");
    const deleteBtn = document.getElementById("deleteBtn");
    const cancelBtn = document.getElementById("cancelDeleteBtn");

    // Check Modal, Delete Button and Cancel Button
    if (!modal || !deleteBtn || !cancelBtn) return;

    // Cancel
    cancelBtn.addEventListener("click", () => {
        deleteBtn.removeAttribute("data-user-id");
        closeModal(modal);
    });

    // Delete Confirm
    deleteBtn.addEventListener("click", async () => {
        // Get Form Data
        const userId = deleteBtn.getAttribute("data-user-id");
        const user = getCurrentUser();

        if (!userId) return;

        try {
            // Send Req
            const response = await fetch(`/api/users/${userId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    user_id: user.id,
                },
            });
            const data = await response.json();

            // Unauthorized
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
                alertMessage(data.message, "success");
                fetchTableUsers();
            } else {
                alertMessage("Gagal: " + data.message, "danger");
            }
        } catch (error) {
            console.error("Error saat menghapus user:", error);
            alertMessage(
                "Terjadi kesalahan sistem saat mencoba menghapus data.",
                "danger",
            );
            closeModal(modal);
        } finally {
            deleteBtn.removeAttribute("data-user-id");
        }
    });
}

async function fetchTableUsers() {
    const tableBody = document.getElementById("user-table-body");
    if (!tableBody) return;

    const user = getCurrentUser();

    try {
        // Send Req
        const response = await fetch("/api/users", {
            headers: {
                user_id: user.id,
            },
        });
        const users = await response.json();

        // Unauthorized
        if (response.status === 401 || response.status === 403) {
            alert(users.message || "Akun Anda tidak aktif.");
            localStorage.removeItem("user");
            window.location.href = "/login";
            return;
        }

        // Data Not Found
        if (!response.ok || !Array.isArray(users) || users.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-6 py-10 text-center text-gray-500 font-medium bg-neutral-primary-soft">
                        Belum ada data user di database Voltora.
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = "";
        users.forEach((u) => {
            const row = document.createElement("tr");
            row.className =
                "bg-neutral-primary-soft border-b border-default hover:bg-neutral-secondary-medium transition-colors";

            // Status Style
            const statusClass = u.status === "active" ? "text-green-600 font-semibold" : "text-gray-500 font-semibold";

            // Role Style
            const roleClass = u.role === "owner" ? "text-purple-600 font-semibold" : "text-blue-600 font-semibold";

            // Check Role Owner
            const actionContent = u.role === "owner"
                ? `<span class="text-gray-400 font-medium">-</span>`
                : `
                    <button 
                        id="edit-btn"
                        class="font-medium text-fg-brand hover:underline bg-transparent border-0 cursor-pointer p-0 mr-3">
                        Edit
                    </button>
                    <button id="delete-btn" class="font-medium text-red-600 hover:underline bg-transparent border-0 cursor-pointer p-0">Delete</button>
                `;

            // Row Table
            row.innerHTML = `
                <td class="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    ${u.id}
                </td>
                <td class="px-6 py-4 text-heading font-medium">
                    ${u.username}
                </td>
                <td class="px-6 py-4 text-body font-medium">
                    ${u.email}
                </td>
                <td class="px-6 py-4 text-body font-medium">
                    <span class="${roleClass}">${u.role}</span>
                </td>
                <td class="px-6 py-4 text-body font-medium">
                    <span class="${statusClass}">${u.status}</span>
                </td>
                <td class="px-6 py-4 text-right whitespace-nowrap">
                    ${actionContent}
                </td>
            `;

            const editBtn = row.querySelector("#edit-btn");
            const deleteBtn = row.querySelector("#delete-btn");

            if (editBtn) {
                editBtn.addEventListener("click", () => {
                    handleEditUser(u);
                });
            }

            if (deleteBtn) {
                deleteBtn.addEventListener("click", () => {
                    handleDeleteUser(u.id, u.username);
                });
            }

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Gagal memuat user:", error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-10 text-center text-red-500 font-medium bg-neutral-primary-soft">
                    Gagal terhubung ke server untuk mengambil data user.
                </td>
            </tr>
        `;
    }
}

function handleEditUser(user) {
    document.getElementById("editUserId").value = user.id;
    document.getElementById("editUserName").value = user.username;
    document.getElementById("editUserEmail").value = user.email;
    document.getElementById("editUserPassword").value = "";
    document.getElementById("editUserStatus").value = user.status;

    const modal = document.getElementById("edit-user-modal");
    openModal(modal);
}

function handleDeleteUser(id, username) {
    const modal = document.getElementById("delete-confirm-modal");

    document.getElementById("deleteBtn").setAttribute("data-user-id", id);
    document.getElementById("delete-modal-text").innerHTML = `
        Apakah Anda yakin ingin menghapus user
        <br>
        <strong>"${username}"</strong>?
    `;

    openModal(modal);
}
