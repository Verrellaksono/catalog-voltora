import { getCurrentUser } from "./utils/auth.js";
import { openModal, closeModal } from "./utils/modal.js";

let categoriesList = [];

document.addEventListener("DOMContentLoaded", () => {
    fetchTableProducts();
    populateCategoryDropdowns();
    initDropdownEvents();
    initAddModalEvents();
    initDeleteModalEvents();
    initEditModalEvents();
});

async function populateCategoryDropdowns() {
    try {
        const response = await fetch("/api/categories");
        const categories = await response.json();

        if (response.ok && Array.isArray(categories)) {
            categoriesList = categories;
            const addList = document.getElementById("categoryDropdownList");
            const editList = document.getElementById("editCategoryDropdownList");

            if (addList) {
                addList.innerHTML = `
                    <li>
                        <button type="button" class="w-full text-left px-4 py-2 hover:bg-neutral-secondary-medium hover:text-fg-brand transition-colors category-option" data-value="">
                            No Category
                        </button>
                    </li>
                `;
                categories.forEach(cat => {
                    addList.innerHTML += `
                        <li>
                            <button type="button" class="w-full text-left px-4 py-2 hover:bg-neutral-secondary-medium hover:text-fg-brand transition-colors category-option" data-value="${cat.id}">
                                ${cat.name}
                            </button>
                        </li>
                    `;
                });

                // Attach click events
                addList.querySelectorAll(".category-option").forEach(btn => {
                    btn.addEventListener("click", () => {
                        const val = btn.getAttribute("data-value");
                        const text = btn.textContent.trim();
                        document.getElementById("productCategory").value = val;
                        document.getElementById("selectedCategoryText").textContent = text;
                        closeCategoryDropdown("categoryDropdownMenu", "categoryChevron");
                    });
                });
            }

            if (editList) {
                editList.innerHTML = `
                    <li>
                        <button type="button" class="w-full text-left px-4 py-2 hover:bg-neutral-secondary-medium hover:text-fg-brand transition-colors edit-category-option" data-value="">
                            No Category
                        </button>
                    </li>
                `;
                categories.forEach(cat => {
                    editList.innerHTML += `
                        <li>
                            <button type="button" class="w-full text-left px-4 py-2 hover:bg-neutral-secondary-medium hover:text-fg-brand transition-colors edit-category-option" data-value="${cat.id}">
                                ${cat.name}
                            </button>
                        </li>
                    `;
                });

                // Attach click events
                editList.querySelectorAll(".edit-category-option").forEach(btn => {
                    btn.addEventListener("click", () => {
                        const val = btn.getAttribute("data-value");
                        const text = btn.textContent.trim();
                        document.getElementById("editProductCategory").value = val;
                        document.getElementById("editSelectedCategoryText").textContent = text;
                        closeCategoryDropdown("editCategoryDropdownMenu", "editCategoryChevron");
                    });
                });
            }
        }
    } catch (err) {
        console.error("Gagal memuat kategori untuk dropdown:", err);
    }
}

function initDropdownEvents() {
    const addBtn = document.getElementById("categoryDropdownBtn");
    const editBtn = document.getElementById("editCategoryDropdownBtn");

    if (addBtn) {
        addBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleCategoryDropdown("categoryDropdownMenu", "categoryChevron");
        });
    }

    if (editBtn) {
        editBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleCategoryDropdown("editCategoryDropdownMenu", "editCategoryChevron");
        });
    }

    // Close on click outside
    document.addEventListener("click", () => {
        closeCategoryDropdown("categoryDropdownMenu", "categoryChevron");
        closeCategoryDropdown("editCategoryDropdownMenu", "editCategoryChevron");
    });
}

function toggleCategoryDropdown(menuId, chevronId) {
    const menu = document.getElementById(menuId);
    const chevron = document.getElementById(chevronId);
    if (!menu) return;

    const isHidden = menu.classList.contains("hidden");
    // Close other dropdowns first
    document.querySelectorAll('[id$="DropdownMenu"]').forEach(m => {
        if (m.id !== menuId) {
            m.classList.add("hidden");
        }
    });
    document.querySelectorAll('[id$="Chevron"]').forEach(c => {
        if (c.id !== chevronId) {
            c.classList.remove("rotate-180");
        }
    });

    if (isHidden) {
        menu.classList.remove("hidden");
        if (chevron) chevron.classList.add("rotate-180");
    } else {
        menu.classList.add("hidden");
        if (chevron) chevron.classList.remove("rotate-180");
    }
}

function closeCategoryDropdown(menuId, chevronId) {
    const menu = document.getElementById(menuId);
    const chevron = document.getElementById(chevronId);
    if (menu) {
        menu.classList.add("hidden");
    }
    if (chevron) {
        chevron.classList.remove("rotate-180");
    }
}

function initAddModalEvents() {
    const modal = document.getElementById("product-modal");
    const form = document.getElementById("productForm");
    const openBtn = document.getElementById("openModalBtn");
    const closeBtn = document.getElementById("closeModalBtn");

    if (!modal || !form) return;

    form.addEventListener("reset", () => {
        document.getElementById("productCategory").value = "";
        const label = document.getElementById("selectedCategoryText");
        if (label) label.textContent = "No Category";
    });

    openBtn.addEventListener("click", () => {
        populateCategoryDropdowns(); // Refresh dropdowns whenever modal opens
        openModal(modal);
    });

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

        // Get Data
        const name = document.getElementById("productName").value;
        const category_id = document.getElementById("productCategory").value;
        const price = document.getElementById("productPrice").value;
        const description = document.getElementById("productDescription").value;
        const imageFile = document.getElementById("productImage").files[0];
        const user = getCurrentUser();

        if (!user) {
            alertMessage("Silakan login terlebih dahulu", "danger");
            window.location.href = "/login";
            return;
        }

        if (!name.trim()) {
            alertMessage("Nama produk tidak boleh kosong", "danger");
            return;
        }

        if (!price || parseFloat(price) < 0) {
            alertMessage("Harga produk tidak valid", "danger");
            return;
        }

        if (!imageFile) {
            alertMessage("Gambar produk wajib diunggah", "danger");
            return;
        }

        // Create FormData for file upload
        const formData = new FormData();
        formData.append("name", name);
        formData.append("category_id", category_id);
        formData.append("price", price);
        formData.append("description", description);
        formData.append("image", imageFile);

        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: {
                    user_id: user.id,
                },
                body: formData,
            });
            const data = await response.json();

            if (response.status === 401 || response.status === 403) {
                alert(data.message);
                localStorage.removeItem("user");
                window.location.href = "/login";
                return;
            }

            if (response.ok) {
                alertMessage(data.message, "success");
                closeModal(modal, form);
                fetchTableProducts();
            } else {
                alertMessage(data.message, "danger");
            }
        } catch (error) {
            console.error("Error submit produk:", error);
            alertMessage(
                "Terjadi kesalahan sistem saat mencoba menyimpan data.",
                "danger",
            );
            closeModal(modal, form);
        }
    });
}

function initDeleteModalEvents() {
    const modal = document.getElementById("delete-confirm-modal");
    const deleteBtn = document.getElementById("deleteBtn");
    const cancelBtn = document.getElementById("cancelDeleteBtn");

    if (!modal || !deleteBtn || !cancelBtn) return;

    cancelBtn.addEventListener("click", () => {
        deleteBtn.removeAttribute("data-product-id");
        closeModal(modal);
    });

    deleteBtn.addEventListener("click", async () => {
        const productId = deleteBtn.getAttribute("data-product-id");
        const user = getCurrentUser();

        if (!productId) return;

        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: "DELETE",
                headers: {
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

            closeModal(modal);

            if (response.ok) {
                alertMessage(data.message, "success");
                fetchTableProducts();
            } else {
                alertMessage("Gagal: " + data.message, "danger");
            }
        } catch (error) {
            console.error("Error saat menghapus produk:", error);
            alertMessage(
                "Terjadi kesalahan sistem saat mencoba menghapus data.",
                "danger",
            );
            closeModal(modal);
        } finally {
            deleteBtn.removeAttribute("data-product-id");
        }
    });
}

function initEditModalEvents() {
    const modal = document.getElementById("edit-product-modal");
    const form = document.getElementById("editProductForm");
    const closeBtn = document.getElementById("closeEditModalBtn");

    if (!modal || !closeBtn || !form) return;

    form.addEventListener("reset", () => {
        document.getElementById("editProductCategory").value = "";
        const label = document.getElementById("editSelectedCategoryText");
        if (label) label.textContent = "No Category";
    });

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
        const productId = document.getElementById("editProductId").value;
        const name = document.getElementById("editProductName").value;
        const category_id = document.getElementById("editProductCategory").value;
        const price = document.getElementById("editProductPrice").value;
        const description = document.getElementById("editProductDescription").value;
        const imageFile = document.getElementById("editProductImage").files[0];

        const user = getCurrentUser();

        if (!productId) return;

        if (!name.trim()) {
            alertMessage("Nama produk tidak boleh kosong", "danger");
            return;
        }

        if (!price || parseFloat(price) < 0) {
            alertMessage("Harga produk tidak valid", "danger");
            return;
        }

        const formData = new FormData();
        formData.append("id", productId);
        formData.append("name", name);
        formData.append("category_id", category_id);
        formData.append("price", price);
        formData.append("description", description);
        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: "PUT",
                headers: {
                    user_id: user.id,
                },
                body: formData,
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
                fetchTableProducts();
            } else {
                alertMessage("Gagal: " + data.message, "danger");
            }
        } catch (error) {
            console.error("Error saat update produk:", error);
            alertMessage("Terjadi kesalahan sistem saat memperbarui data.", "danger");
            closeModal(modal, form);
        }
    });
}

async function fetchTableProducts() {
    const tableBody = document.getElementById("product-table-body");
    if (!tableBody) return;

    try {
        const response = await fetch("/api/products");
        const products = await response.json();

        if (!response.ok || !Array.isArray(products) || products.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="px-6 py-10 text-center text-gray-500 font-medium bg-neutral-primary-soft rounded-b-xl">
                        Belum ada data produk di database Voltora.
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = "";
        products.forEach((product) => {
            const formattedPrice = new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
            }).format(product.price);

            const row = document.createElement("tr");
            row.className =
                "bg-neutral-primary-soft border-b border-default hover:bg-neutral-secondary-medium transition-colors";

            const imgHtml = product.image
                ? `<img src="${product.image}" alt="${product.name}" class="w-10 h-10 object-cover rounded-base border border-default mx-auto" />`
                : `<div class="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-base border border-default text-[10px] text-gray-400 mx-auto">No Img</div>`;

            row.innerHTML = `
                <td class="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    ${product.id}
                </td>
                <td class="px-6 py-4 font-medium text-heading whitespace-nowrap text-center">
                    ${imgHtml}
                </td>
                <th scope="row" class="px-6 py-4 font-medium text-heading whitespace-nowrap">
                    ${product.name}
                </th>
                <td class="px-6 py-4 text-body font-medium">
                    ${product.category_name || "-"}
                </td>
                <td class="px-6 py-4 text-heading font-medium">
                    ${formattedPrice}
                </td>
                <td class="px-6 py-4 text-body max-w-xs truncate">
                    ${product.description || "-"}
                </td>
                <td class="px-6 py-4 text-right whitespace-nowrap">
                    <button 
                        id="edit-btn"
                        class="font-medium text-fg-brand hover:underline bg-transparent border-0 cursor-pointer p-0 mr-3">
                        Edit
                    </button>
                    <button 
                        id="delete-btn" 
                        class="font-medium text-red-600 hover:underline bg-transparent border-0 cursor-pointer p-0">
                        Delete
                    </button>
                </td>
            `;

            const editBtn = row.querySelector("#edit-btn");
            const deleteBtn = row.querySelector("#delete-btn");

            editBtn.addEventListener("click", () => {
                handleEditProduct(product);
            });

            deleteBtn.addEventListener("click", () => {
                handleDeleteProduct(product.id, product.name);
            });

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Gagal memuat produk:", error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-10 text-center text-red-500 font-medium bg-neutral-primary-soft rounded-b-xl">
                    Gagal terhubung ke server untuk mengambil data produk.
                </td>
            </tr>
        `;
    }
}

function handleEditProduct(product) {
    document.getElementById("editProductId").value = product.id;
    document.getElementById("editProductName").value = product.name;

    // Make sure options exist before setting value
    populateCategoryDropdowns().then(() => {
        const val = product.category_id || "";
        document.getElementById("editProductCategory").value = val;
        let catName = "No Category";
        if (val) {
            const cat = categoriesList.find(c => String(c.id) === String(val));
            if (cat) catName = cat.name;
        }
        const label = document.getElementById("editSelectedCategoryText");
        if (label) label.textContent = catName;
    });

    document.getElementById("editProductPrice").value = product.price;
    document.getElementById("editProductDescription").value = product.description || "";

    const currentImgContainer = document.getElementById("currentImageContainer");
    if (currentImgContainer) {
        if (product.image) {
            currentImgContainer.innerHTML = `<img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover" />`;
        } else {
            currentImgContainer.innerHTML = `<span class="text-xs text-gray-400">No Image</span>`;
        }
    }

    const modal = document.getElementById("edit-product-modal");
    openModal(modal);
}

function handleDeleteProduct(id, name) {
    const modal = document.getElementById("delete-confirm-modal");
    document.getElementById("deleteBtn").setAttribute("data-product-id", id);
    document.getElementById("delete-modal-text").innerHTML = `
        Apakah Anda yakin ingin menghapus produk
        <br>
        <strong>"${name}"</strong>?
    `;
    openModal(modal);
}
