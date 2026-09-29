document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        clearErrors();

        const name = document.getElementById("contact-name").value.trim();
        const email = document.getElementById("contact-email").value.trim();
        const message = document.getElementById("contact-message").value.trim();

        let valid = true;

        if (name.length < 2) {
            document.getElementById("name-error").textContent =
                "Please enter at least 2 characters.";
            valid = false;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            document.getElementById("email-error").textContent =
                "Please enter a valid email address.";
            valid = false;
        }

        if (message.length < 10) {
            document.getElementById("message-error").textContent =
                "Message must contain at least 10 characters.";
            valid = false;
        }

        if (!valid) {
            return;
        }

        document.getElementById("contact-success").innerHTML =
            `<div class="success">
                Thank you. Your feedback has been validated successfully.
             </div>`;

        form.reset();
    });
});

function clearErrors() {
    document.getElementById("name-error").textContent = "";
    document.getElementById("email-error").textContent = "";
    document.getElementById("message-error").textContent = "";
    document.getElementById("contact-success").innerHTML = "";

}
