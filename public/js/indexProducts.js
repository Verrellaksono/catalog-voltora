let allProducts = [];
let allCategories = [];
let selectedCategoryId = null;

document.addEventListener("DOMContentLoaded", () => {
    initIndexPage();
});

async function initIndexPage() {
    await fetchCategories();
    await fetchProducts();
    renderCategoryButtons();
    renderProducts();
    initModalEvents();
}

async function fetchCategories() {
    try {
        const response = await fetch("/api/categories");
        if (response.ok) {
            allCategories = await response.json();
        }
    } catch (err) {
        console.error("Gagal mengambil data kategori:", err);
    }
}

async function fetchProducts() {
    try {
        const response = await fetch("/api/products");
        if (response.ok) {
            allProducts = await response.json();
        }
    } catch (err) {
        console.error("Gagal mengambil data produk:", err);
    }
}

function renderCategoryButtons() {
    const container = document.getElementById("category-buttons");
    if (!container) return;

    container.innerHTML = "";

    // Button All
    const allBtn = document.createElement("button");
    allBtn.type = "button";
    allBtn.textContent = "All";

    if (selectedCategoryId === null) {
        allBtn.className =
            "text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-xs px-3 py-1.5 md:text-sm md:px-4 md:py-2.5 focus:outline-none transition-colors cursor-pointer";
    } else {
        allBtn.className =
            "text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-xs px-3 py-1.5 md:text-sm md:px-4 md:py-2.5 focus:outline-none transition-colors cursor-pointer";
    }

    allBtn.addEventListener("click", () => {
        selectedCategoryId = null;
        renderCategoryButtons();
        renderProducts();
    });

    container.appendChild(allBtn);

    // Buttons for each category
    allCategories.forEach((cat) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = cat.name;

        if (selectedCategoryId === cat.id) {
            btn.className =
                "text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-xs px-3 py-1.5 md:text-sm md:px-4 md:py-2.5 focus:outline-none transition-colors cursor-pointer";
        } else {
            btn.className =
                "text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-xs px-3 py-1.5 md:text-sm md:px-4 md:py-2.5 focus:outline-none transition-colors cursor-pointer";
        }

        btn.addEventListener("click", () => {
            selectedCategoryId = cat.id;
            renderCategoryButtons();
            renderProducts();
        });

        container.appendChild(btn);
    });
}

function renderProducts() {
    const listContainer = document.getElementById("product-card-list");
    if (!listContainer) return;

    // Filter products
    const filteredProducts =
        selectedCategoryId === null
            ? allProducts
            : allProducts.filter((p) => p.category_id === selectedCategoryId);

    if (filteredProducts.length === 0) {
        listContainer.innerHTML = `
            <div class="w-full col-span-full text-center py-12 text-gray-500 font-medium bg-neutral-primary-soft border border-default border-dashed rounded-base">
                Belum ada produk untuk kategori ini.
            </div>
        `;
        return;
    }

    listContainer.innerHTML = "";

    filteredProducts.forEach((product) => {
        const formattedPrice = new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(product.price);

        const imgPath = product.image ? product.image : "./images/fan.jpg";

        const card = document.createElement("div");
        card.className =
            "bg-neutral-primary-soft block border border-default rounded-base shadow-xs w-full overflow-hidden flex flex-col justify-between cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-300";
        card.setAttribute("data-product-id", product.id);
        card.innerHTML = `
            <div>
                <img
                    class="product-card-img rounded-t-base w-full h-48 object-cover hover:opacity-90 transition-opacity"
                    src="${imgPath}"
                    alt="${product.name}"
                />
                <div class="p-6">
                    <div class="flex flex-col gap-3">
                        <h3 class="text-lg md:text-xl font-semibold text-heading text-left truncate" title="${product.name}">
                            ${product.name}
                        </h3>
                        <p class="text-body font-medium text-justify text-sm md:text-base leading-relaxed line-clamp-3 text-ellipsis overflow-hidden" title="${product.description || ""}">
                            ${product.description || "-"}
                        </p>
                    </div>
                </div>
            </div>
            <div class="px-6 pb-6 flex items-center justify-between">
                <span class="text-[10px] md:text-xs font-semibold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">
                    ${product.category_name || "Kategori"}
                </span>
                <h4 class="text-lg md:text-xl font-semibold text-heading text-right">
                    ${formattedPrice}
                </h4>
            </div>
        `;
        listContainer.appendChild(card);
    });
}

function initModalEvents() {
    const cardList = document.getElementById("product-card-list");
    const modalElement = document.getElementById("product-detail-modal");
    const modalContent = document.getElementById("product-detail-content");
    const closeBtn = document.getElementById("close-detail-modal");

    // Modal elements to populate dynamically
    const modalImage = document.getElementById("modal-detail-image");
    const modalCategory = document.getElementById("modal-detail-category");
    const modalName = document.getElementById("modal-detail-name");
    const modalPrice = document.getElementById("modal-detail-price");
    const modalDescription = document.getElementById("modal-detail-description");

    if (cardList && modalElement && modalContent) {
        // Delegate click event from cards container to card itself
        cardList.addEventListener("click", (e) => {
            const card = e.target.closest("[data-product-id]");
            if (card) {
                const productId = parseInt(card.getAttribute("data-product-id"));
                const product = allProducts.find((p) => p.id === productId);
                
                if (product) {
                    // Populate details
                    const formattedPrice = new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                    }).format(product.price);
                    
                    modalImage.src = product.image ? product.image : "./images/fan.jpg";
                    modalImage.alt = product.name;
                    modalCategory.textContent = product.category_name || "Elektronik";
                    modalName.textContent = product.name;
                    modalPrice.textContent = formattedPrice;
                    modalDescription.textContent = product.description || "Tidak ada deskripsi produk.";

                    // Open Modal with smooth transition
                    modalElement.classList.remove("hidden");
                    modalElement.classList.add("flex");
                    
                    // Trigger reflow to start transition
                    setTimeout(() => {
                        modalContent.classList.remove("scale-95", "opacity-0");
                        modalContent.classList.add("scale-100", "opacity-100");
                    }, 10);
                }
            }
        });

        // Function to close modal
        const closeModal = () => {
            modalContent.classList.remove("scale-100", "opacity-100");
            modalContent.classList.add("scale-95", "opacity-0");
            setTimeout(() => {
                modalElement.classList.add("hidden");
                modalElement.classList.remove("flex");
            }, 300); // matching CSS transition duration-300
        };

        // Close modal on close button click
        if (closeBtn) {
            closeBtn.addEventListener("click", closeModal);
        }

        // Close modal when clicking on backdrop
        modalElement.addEventListener("click", (e) => {
            if (e.target === modalElement) {
                closeModal();
            }
        });

        // Close modal on Escape key press
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && !modalElement.classList.contains("hidden")) {
                closeModal();
            }
        });
    }
}
