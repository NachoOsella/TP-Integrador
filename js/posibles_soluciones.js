// posible solucion para el registro de usuarios
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

    // Crear el objeto de datos del usuario
    const newUser = {
        username: username,
        email: email,
        password: password
    };

    // Enviar los datos a la API de registro
    fetch('https://tudominio.com/api/registro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
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



// posible solucion para el inicio de sesion
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

    // Enviar una solicitud a la API para validar las credenciales
    fetch('https://tu-api.com/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
        // Procesar la respuesta de la API
        .then(response => response.json())
        // Realizar acciones en base a la respuesta
        .then(data => {
            // Verificar si la respuesta es exitosa
            if (data.success) {
                // Redirigir a otra página o realizar otra acción
                window.location.href = `main.html?username=${encodeURIComponent(username)}`;
            } else {
                errorMsg.innerText = "Credenciales inválidas. Intenta de nuevo.";
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorMsg.innerText = "Ocurrió un error. Intenta de nuevo.";
        });
});


// posible solucion para obtener las peliculas y mostrarlas
async function mostrarPeliculas() {
    const response = await fetch('/api/peliculas'); // Solicitud GET al endpoint de películas
    const data = await response.json();
    const tbody = document.getElementById('tbody');
    tbody.innerHTML = ''; // Limpiar contenido existente

    data.forEach(pelicula => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="display: none;">${pelicula.id}</td>
            <td>${pelicula.titulo}</td>
            <td>${pelicula.director}</td>
            <td>${pelicula.anio}</td>
            <td>${pelicula.genero}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarPelicula(${pelicula.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarPelicula(${pelicula.id})">Eliminar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}


// posible solucion para editar peliculas
async function editarPelicula(id) {
    try {
        // Obtener datos de la película desde la API
        const response = await fetch(`/api/peliculas/${id}`);
        const peli = await response.json();

        cargar_vista('modificacion.html', () => {
            const $titulo = document.getElementById('titulo');
            const $anio = document.getElementById('anio');
            const $director = document.getElementById('director');
            const $genero = document.getElementById('genero');

            // Rellenar los campos con los datos actuales
            $titulo.value = peli.titulo;
            $anio.value = peli.anio;
            $director.value = peli.director;
            $genero.value = peli.genero;

            // Evento para guardar los cambios
            document.getElementById('guardar').onclick = async function () {
                const updatedPeli = {
                    titulo: $titulo.value,
                    anio: $anio.value,
                    director: $director.value,
                    genero: $genero.value
                };

                const result = await fetch(`/api/peliculas/${id}`, {
                    method: 'PUT', // Método PUT para actualizar
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedPeli)
                });

                if (result.ok) {
                    alert('Película actualizada correctamente');
                    mostrarPeliculas(); // Actualizar la tabla
                } else {
                    alert('Error al actualizar la película.');
                }
            };
        });
    } catch (error) {
        console.error("Error al editar la película:", error);
    }
}

// posible solucion para eliminar peliculas
function eliminarPelicula(id) {
    if (confirm('¿Estás seguro de eliminar esta película?')) {
        fetch(`/api/peliculas/${id}`, { method: 'DELETE' })
            .then(res => {
                if (res.ok) {
                    alert('Película eliminada correctamente');
                    mostrarPeliculas();
                } else {
                    alert('Error al eliminar la película.');
                }
            })
            .catch(err => console.error('Error:', err));
    }
}