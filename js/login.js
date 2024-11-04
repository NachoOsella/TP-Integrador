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



// POSIBLE SOLUCIÓN

// Añade un evento 'submit' al formulario con id 'loginForm'
// document
//     .getElementById("loginForm")
//     .addEventListener("submit", async function (event) {
//         // Previene el comportamiento por defecto del formulario (recargar la página)
//         event.preventDefault();

//         // Obtiene los valores de los campos de entrada 'username' y 'password'
//         const username = document.getElementById("username").value;
//         const password = document.getElementById("password").value;

//         try {
//             // Envía una solicitud POST a la API de inicio de sesión
//             const response = await fetch("/api/login", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ username, password }), // Envía los datos de usuario y contraseña en el cuerpo de la solicitud
//             });

//             // Convierte la respuesta en un objeto JSON
//             const result = await response.json();

//             // Si la respuesta es exitosa, limpia el mensaje de error y redirige a 'main.html'
//             // Si no, muestra el mensaje de error devuelto por la API o un mensaje por defecto
//             document.getElementById("errorMsg").innerText = response.ok
//                 ? ""
//                 : result.message || "Inicio de sesión fallido.";
//             if (response.ok) window.location.href = "main.html";
//         } catch (error) {
//             // Si ocurre un error durante la solicitud, lo muestra en la consola y muestra un mensaje de error en la página
//             console.error("Error:", error);
//             document.getElementById("errorMsg").innerText =
//                 "Ocurrió un error durante el inicio de sesión.";
//         }
//     });
