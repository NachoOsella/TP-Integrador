document.getElementById("registerForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita el envío del formulario

    // Obtener los valores de los campos
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        document.getElementById("errorMsg").innerText = "Las contraseñas no coinciden. Intenta de nuevo.";
        return;
    }

    // Simulación de registro de usuario
    const newUser = {
        username: username,
        email: email,
        password: password
    };

    console.log("Usuario registrado:", newUser);
    alert('Registro exitoso!');

    // Redirigir a la página de inicio de sesión
    window.location.href = 'login.html';
});

// Mostrar/ocultar contraseña
document.getElementById("togglePasswordCheckbox").addEventListener("change", function () {
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    if (this.checked) {
        passwordInput.type = "text";
        confirmPasswordInput.type = "text";
    } else {
        passwordInput.type = "password";
        confirmPasswordInput.type = "password";
    }
});