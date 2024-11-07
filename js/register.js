document.getElementById("registerForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita el envío del formulario

    // Obtener los valores de los campos
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const telefono = document.getElementById("telefono").value;
    // const idTipoDoc = document.getElementById("idTipoDoc").value;
    const dni = document.getElementById("dni").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        document.getElementById("errorMsg").innerText = "Las contraseñas no coinciden. Intenta de nuevo.";
        return;
    }

    // Crear el objeto de datos del usuario
    const newUser = {
        nombre: nombre,
        apellido: apellido,
        telefono: telefono,
        idTipoDoc: 1,
        dni: dni,
        Mail: email,
        Contraseña: password,
        RepetirContraseña: confirmPassword
    };

    // Enviar los datos a la API de registro
    fetch('http://localhost:5103/api/Clientes/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.mensaje === "Usuario registrado exitosamente") {
                alert('Registro exitoso!');
                // Redirigir a la página de inicio de sesión
                window.location.href = 'login.html';
            } else {
                document.getElementById("errorMsg").innerText = data.message || "Error en el registro.";
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            document.getElementById("errorMsg").innerText = "Ocurrió un error. Intenta de nuevo.";
        });
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