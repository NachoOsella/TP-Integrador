const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const errorMsg = document.getElementById("errorMsg");
const togglePasswordCheckbox = document.getElementById("togglePasswordCheckbox");
const registerButton = document.getElementById("registerButton");

loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita el envío del formulario

    // Obtener los valores de los campos
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Validación de campos vacíos
    if (!username || !password) {
        errorMsg.innerText = "Por favor, completa todos los campos.";
        return;
    }

    // Simulación de validación de credenciales
    if (username === "aa" && password === "aa") {
        // Simulación de generación de token
        const token = "token123456"; // Este sería el token que recibirías del servidor
        localStorage.setItem("authToken", token); // Almacena el token en localStorage
        // Redirigir a otra página o realizar otra acción
        window.location.href = `main.html?username=${encodeURIComponent(username)}`;
    } else {
        errorMsg.innerText = "Credenciales inválidas. Intenta de nuevo.";
    }
});

togglePasswordCheckbox.addEventListener("change", function () {
    if (this.checked) {
        passwordInput.type = "text"; // Muestra la contraseña haciendo que el tipo de input sea 'text'
    } else {
        passwordInput.type = "password"; // Oculta la contraseña haciendo que el tipo de input sea 'password'
    }
});

registerButton.addEventListener("click", function () {
    window.location.href = "registro.html";
});