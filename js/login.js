// Inicializar elementos del DOM
const formularioLogin = document.getElementById('loginForm');
const inputEmail = document.getElementById('email');
const inputContraseña = document.getElementById('password');
const mensajeError = document.getElementById('errorMsg');
const checkboxMostrarContraseña = document.getElementById('togglePasswordCheckbox');
const botonRegistro = document.getElementById('registerButton');

// Mostrar u ocultar la contraseña al hacer clic en el checkbox
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

// Envío del formulario de inicio de sesión cuando se hace clic en el botón de inicio de sesión
formularioLogin.addEventListener('submit', function (evento) {
    evento.preventDefault();

    // Obtiene y limpia los valores de los campos de email y contraseña
    const mail = inputEmail.value.trim();
    const contraseña = inputContraseña.value.trim();

    // Verifica si los campos están vacíos y muestra un mensaje de error si es así
    if (!mail || !contraseña) {
        mensajeError.innerText = 'Por favor, completa todos los campos.';
        return;
    }
    fetch('http://localhost:5069/api/Cliente/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mail, contraseña })
    })
        .then(respuesta => {
            // Verifica si la respuesta no es exitosa
            if (!respuesta.ok) {
                if (respuesta.status === 404) {
                    mensajeError.innerText = 'Credenciales inválidas. Intenta de nuevo.';
                } else {
                    return respuesta.text().then(texto => {
                        throw new Error(`Error en la red: ${respuesta.status} ${respuesta.statusText} - ${texto}`);
                    });
                }
            } else {
                return respuesta.json();
            }
        })
        .then(datos => {

            if (datos && datos.mensaje === "Inicio de sesión exitoso") {
                // Almacena en el localstorage un item para validar si el usuario está autenticado
                localStorage.setItem('isAuthenticated', 'true');
                window.location.href = `main.html?usuario=${encodeURIComponent(mail)}`;
            }
        })
        .catch(error => {
            if (!mensajeError.innerText) {
                mensajeError.innerText = 'Error al intentar iniciar sesión. Por favor, intenta más tarde.';
            }
            console.error('Error:', error);
        });
});