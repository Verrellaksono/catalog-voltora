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
        allBtn.className = "text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-xs px-3 py-1.5 md:text-sm md:px-4 md:py-2.5 focus:outline-none transition-colors cursor-pointer";
    } else {
        allBtn.className = "text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-xs px-3 py-1.5 md:text-sm md:px-4 md:py-2.5 focus:outline-none transition-colors cursor-pointer";
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
            btn.className = "text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-xs px-3 py-1.5 md:text-sm md:px-4 md:py-2.5 focus:outline-none transition-colors cursor-pointer";
        } else {
            btn.className = "text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-xs px-3 py-1.5 md:text-sm md:px-4 md:py-2.5 focus:outline-none transition-colors cursor-pointer";
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
    const filteredProducts = selectedCategoryId === null
        ? allProducts
        : allProducts.filter(p => p.category_id === selectedCategoryId);

    if (filteredProducts.length === 0) {
        listContainer.innerHTML = `
            <div class="w-full text-center py-12 text-gray-500 font-medium bg-neutral-primary-soft border border-default border-dashed rounded-base">
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
        card.className = "bg-neutral-primary-soft block border border-default rounded-base shadow-xs w-44 md:w-72 overflow-hidden flex flex-col justify-between";
        card.innerHTML = `
            <div>
                <img
                    class="product-card-img rounded-t-base w-full h-48 object-cover cursor-pointer hover:opacity-60 transition-opacity"
                    src="${imgPath}"
                    alt="${product.name}"
                />
                <div class="p-6">
                    <div class="flex flex-col gap-3">
                        <h3 class="text-lg md:text-xl font-semibold text-heading text-left truncate" title="${product.name}">
                            ${product.name}
                        </h3>
                        <p class="text-body font-medium text-justify text-sm md:text-base leading-relaxed line-clamp-3 text-ellipsis overflow-hidden" title="${product.description || ''}">
                            ${product.description || "-"}
                        </p>
                    </div>
                </div>
            </div>
            <div class="px-6 pb-6">
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
    const modalElement = document.getElementById("product-image-modal");
    const modalTargetImage = document.getElementById("modal-target-image");

    if (cardList && modalElement && modalTargetImage) {
        // Delegate click event from cards container to image
        cardList.addEventListener("click", (e) => {
            if (e.target.classList.contains("product-card-img")) {
                const imageSrc = e.target.getAttribute("src");
                if (imageSrc) {
                    modalTargetImage.setAttribute("src", imageSrc);
                    modalElement.classList.remove("hidden");
                    modalElement.classList.add("flex");
                }
            }
        });

        // Close modal when clicking on backdrop
        modalElement.addEventListener("click", (e) => {
            if (e.target === modalElement) {
                modalElement.classList.add("hidden");
                modalElement.classList.remove("flex");
            }
        });
    }
}
