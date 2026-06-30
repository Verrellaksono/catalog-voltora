document.addEventListener("DOMContentLoaded", () => {
    const modalTargetImage = document.getElementById("modal-target-image");
    const productImages = document.querySelectorAll(".product-card-img");

    if (modalTargetImage && productImages.length > 0) {
        productImages.forEach((img) => {
            img.addEventListener("click", () => {
                const imageSrc = img.getAttribute("src");

                if (imageSrc) {
                    modalTargetImage.setAttribute("src", imageSrc);

                    const modalElement = document.getElementById(
                        "product-image-modal",
                    );
                    if (typeof Modal !== "undefined") {
                        const flowbiteModal = new Modal(modalElement);
                        flowbiteModal.show();
                    } else {
                        modalElement.classList.remove("hidden");
                        modalElement.classList.add("flex");
                    }
                }
            });
        });
    }

    // Toggle Password Visibility
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const eyeIcon = this.querySelector('.eye-icon');
            const eyeSlashIcon = this.querySelector('.eye-slash-icon');
            
            if (input.type === 'password') {
                input.type = 'text';
                if(eyeIcon) eyeIcon.classList.add('hidden');
                if(eyeSlashIcon) eyeSlashIcon.classList.remove('hidden');
            } else {
                input.type = 'password';
                if(eyeIcon) eyeIcon.classList.remove('hidden');
                if(eyeSlashIcon) eyeSlashIcon.classList.add('hidden');
            }
        });
    });
});
