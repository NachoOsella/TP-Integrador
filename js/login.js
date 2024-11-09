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
// Añade un evento al formulario de login que se ejecuta cuando se envía
formularioLogin.addEventListener('submit', function (evento) {
    // Previene el comportamiento por defecto del formulario (recargar la página)
    evento.preventDefault();

    // Obtiene y limpia los valores de los campos de email y contraseña
    const mail = inputEmail.value.trim();
    const contraseña = inputContraseña.value.trim();

    // Verifica si los campos están vacíos y muestra un mensaje de error si es así
    if (!mail || !contraseña) {
        mensajeError.innerText = 'Por favor, completa todos los campos.';
        return;
    }

    // Realiza una solicitud POST a la API de login
    fetch('http://localhost:5069/api/Cliente/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mail, contraseña }) // Envía los datos de login en el cuerpo de la solicitud
    })
        .then(respuesta => {
            // Verifica si la respuesta no es exitosa
            if (!respuesta.ok) {
                // Si el estado es 404, muestra un mensaje de credenciales inválidas
                if (respuesta.status === 404) {
                    mensajeError.innerText = 'Credenciales inválidas. Intenta de nuevo.';
                } else {
                    // Si hay otro error, lanza un error con el estado y el texto de la respuesta
                    return respuesta.text().then(texto => {
                        throw new Error(`Error en la red: ${respuesta.status} ${respuesta.statusText} - ${texto}`);
                    });
                }
            } else {
                // Si la respuesta es exitosa, convierte la respuesta a JSON
                return respuesta.json();
            }
        })
        .then(datos => {
            // Si los datos contienen un mensaje de éxito, guarda el estado de autenticación y redirige
            if (datos && datos.mensaje === "Inicio de sesión exitoso") {
                localStorage.setItem('isAuthenticated', 'true'); // Guarda el estado de autenticación en localStorage
                window.location.href = `main.html?usuario=${encodeURIComponent(mail)}`; // Redirige a la página principal
            }
        })
        .catch(error => {
            // Si ocurre un error y no hay un mensaje de error ya mostrado, muestra un mensaje genérico
            if (!mensajeError.innerText) {
                mensajeError.innerText = 'Error al intentar iniciar sesión. Por favor, intenta más tarde.';
            }
            console.error('Error:', error); // Muestra el error en la consola
        });
});