document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
        event.preventDefault(); // Evita el envío del formulario

        // Obtener los valores de los campos
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Simulación de validación de credenciales
        if (username === "aa" && password === "aa") {
            // Simulación de generación de token
            const token = "token123456"; // Este sería el token que recibirías del servidor
            localStorage.setItem("authToken", token); // Almacena el token en localStorage
            // alert('Inicio de sesión exitoso!');
            // Redirigir a otra página o realizar otra acción
            window.location.href = `main.html?username=${encodeURIComponent(
                username
            )}`;
        } else {
            document.getElementById("errorMsg").innerText =
                "Credenciales inválidas. Intenta de nuevo.";
        }
    });

// mostrar/ocultar contraseña
document
    .getElementById("togglePasswordCheckbox")
    .addEventListener("change", function () {
        const passwordInput = document.getElementById("password");
        if (this.checked) {
            // Si el checkbox está marcado
            passwordInput.type = "text"; // Muestra la contraseña haciendo que el tipo de input sea 'text'
        } else {
            passwordInput.type = "password"; // Oculta la contraseña haciendo que el tipo de input sea 'password'
        }
    });

