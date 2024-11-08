// funcion para cargar el html de una pagina pasado por parametro
function cargar_vista(url, callback = null) { // parámetro opcional
    fetch(url)
        .then((res) => {
            return res.text()
        })
        .then((txt) => {
            const $panel_content = document.getElementById('dynamic-content')
            $panel_content.innerHTML = txt

            if (callback) // si me pasaron una callback entonces la ejecuto
                callback();
        })
}


async function mostrarPeliculas() {
    try {
        // Enviar solicitud GET al endpoint de obtener películas
        const response = await fetch('http://localhost:5171/api/Cine/GetPeliculas');
        // Si la respuesta no es exitosa, lanzar un error
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        // Convertir la respuesta a JSON
        const data = await response.json();

        // Obtener la tabla de películas
        const tbody = document.getElementById('tbody');
        tbody.innerHTML = ''; // Limpiar contenido existente

        // Iterar sobre las películas y agregarlas a la tabla (sin mostrar el id)
        data.forEach(pelicula => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="display: none;">${pelicula.idPelicula}</td>
                <td>${pelicula.titulo}</td>
                <td>${pelicula.directorNavigation.descripcion}</td>
                <td>${pelicula.duracion}</td>
                <td>${pelicula.generoNavigation.descripcion}</td>
                <td>${pelicula.edadNavigation.clasificacion}</td>
                <td>${pelicula.descripcion}</td>
                <td>${pelicula.estreno ? 'Sí' : 'No'}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarPelicula(${pelicula.idPelicula})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarPelicula(${pelicula.idPelicula})">Quitar de Cartelera</button>
                </td>
            `;
            // Agregar fila a la tabla
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al mostrar las películas:', error);
    }
}

// logica del borrado logico de peliculas
async function eliminarPelicula(idPelicula) {
    // Confirmar si el usuario desea eliminar la película
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta película?');
    if (!confirmacion) {
        return;
    }
    try {
        // Enviar solicitud DELETE al endpoint de eliminar película
        const response = await fetch(`http://localhost:5171/api/Cine/DeletePelicula${idPelicula}`, {
            method: 'DELETE'
        });
        console.log(response);

        // Si la respuesta es exitosa, mostrar las películas actualizadas
        if (response.ok) {
            mostrarPeliculas();
            // Si la respuesta no es exitosa, mostrar un mensaje de error
        } else {
            console.error('Error al eliminar la película');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// logica para agregar una pelicula
async function agregarPelicula() {
    // Obtener valores del formulario
    const pelicula = {
        titulo: document.getElementById('titulo').value,
        idGenero: parseInt(document.getElementById('idGenero').value),
        idEdad: parseInt(document.getElementById('idEdad').value),
        duracion: parseInt(document.getElementById('duracion').value),
        descripcion: document.getElementById('descripcion').value,
        idDirector: parseInt(document.getElementById('idDirector').value),
        estreno: document.getElementById('estreno').checked
    };

    try {
        // Enviar solicitud POST al endpoint de agregar película
        const response = await fetch('http://localhost:5171/api/Cine/registrarPelicula', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pelicula)
        });

        // Si la respuesta no es exitosa, lanzar un error
        if (!response.ok) {
            throw new Error('Error al agregar la película');
        }

        // Mostrar mensaje de éxito
        alert('Película agregada exitosamente');

    } catch (error) {
        console.error('Error:', error);
        alert('Error al agregar la película');
    }
}



// Función asincrónica para obtener las películas desde el servidor
async function obtenerPeliculas() {
    try {
        // Imprime un mensaje en la consola indicando que se están obteniendo las películas
        console.log('Fetching movies from the server...');

        // Realiza una solicitud fetch a la API para obtener las películas
        const response = await fetch('http://localhost:5171/api/Cine/GetPeliculas');

        // Imprime el estado de la respuesta en la consola
        console.log('Response status:', response.status);

        // Verifica si la respuesta no es correcta (status no en el rango 200-299)
        if (!response.ok) {
            // Lanza un error si la respuesta no es correcta
            throw new Error('Error al obtener las películas');
        }

        // Convierte la respuesta a formato JSON
        const peliculas = await response.json();

        // Retorna las películas obtenidas
        return peliculas;
    } catch (error) {
        // Imprime el error en la consola
        console.error('Error:', error);

        // Retorna un arreglo vacío en caso de error
        return [];
    }
}

// Función para mostrar las películas en tarjetas
async function mostrarPeliculasEnTarjetas() {
    // Llama a la función obtenerPeliculas y almacena el resultado en la variable peliculas
    const peliculas = await obtenerPeliculas();

    // Obtiene el contenedor de películas del DOM
    const contenedor = document.getElementById('contenedor-peliculas');

    // Limpia el contenido del contenedor
    contenedor.innerHTML = '';

    // Itera sobre cada película obtenida
    peliculas.forEach(pelicula => {
        // Crea un nuevo elemento div para la tarjeta de la película
        const tarjeta = document.createElement('div');

        // Asigna la clase 'card' al div
        tarjeta.className = 'card';

        // Define el contenido HTML de la tarjeta
        tarjeta.innerHTML = `
            <img src="${pelicula.url}" class="card-img-top" alt="${pelicula.titulo}">
            <div class="card-body">
                <h5 class="card-title">${pelicula.titulo}</h5>
                <p class="card-text">${pelicula.descripcion}</p>
                <button class="btn btn-primary" onclick="venderTicket(${pelicula.idPelicula})">Vender Ticket</button>
            </div>
        `;

        // Añade la tarjeta al contenedor de películas
        contenedor.appendChild(tarjeta);
    });
}

function venderTicket(idPelicula) {
    // Redirigir a la página de transacción con el ID de la película
    window.location.href = `transaccionxpelicula.html?id=${idPelicula}`;
}