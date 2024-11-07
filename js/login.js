// login.js
// Inicializar elementos del DOM
const formularioLogin = document.getElementById('loginForm');
const inputEmail = document.getElementById('email');
const inputContraseña = document.getElementById('password');
const mensajeError = document.getElementById('errorMsg');
const checkboxMostrarContraseña = document.getElementById('togglePasswordCheckbox');
const botonRegistro = document.getElementById('registerButton');

// Alternar visibilidad de la contraseña
checkboxMostrarContraseña.addEventListener('change', function () {
    if (this.checked) {
        inputContraseña.type = 'text';
    } else {
        inputContraseña.type = 'password';
    }
});

// Manejar clic en el botón de registro
botonRegistro.addEventListener('click', function (evento) {
    evento.preventDefault();
    window.location.href = 'registro.html';
});

// Envío del formulario de inicio de sesión
formularioLogin.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const mail = inputEmail.value.trim();
    const contraseña = inputContraseña.value.trim();

    if (!mail || !contraseña) {
        mensajeError.innerText = 'Por favor, completa todos los campos.';
        return;
    }

    fetch('http://localhost:5103/api/Clientes/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mail, contraseña })
    })
        .then(respuesta => {
            if (!respuesta.ok) {
                return respuesta.text().then(texto => {
                    throw new Error(`Error en la red: ${respuesta.status} ${respuesta.statusText} - ${texto}`);
                });
            }
            return respuesta.json();
        })
        .then(datos => {
            console.log('Respuesta:', datos); // Quitar en versión final
            // Redirigir a la página principal si el inicio de sesión fue exitoso
            if (datos.mensaje === "Inicio de sesión exitoso") {
                window.location.href = `main.html?usuario=${encodeURIComponent(mail)}`;
            } else {
                mensajeError.innerText = 'Credenciales inválidas. Intenta de nuevo.';
            }
        })
        .catch(error => {
            mensajeError.innerText = 'Error al intentar iniciar sesión. Por favor, intenta más tarde.';
            console.error('Error:', error);
        });
});