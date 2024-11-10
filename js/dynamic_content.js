function cargar_vista(url, ...callbacks) {
    fetch(url)
        .then((res) => res.text())
        .then((txt) => {
            const $panel_content = document.getElementById('dynamic-content');
            $panel_content.innerHTML = txt;

            // Ejecutar todas las callbacks si se pasaron
            callbacks.forEach(callback => {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        })
        .catch((error) => console.error('Error al cargar la vista:', error));
}


async function mostrarPeliculas() {
    try {
        // Enviar solicitud GET al endpoint de obtener películas
        const response = await fetch('http://localhost:5069/api/Cine/GetPeliculas');
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
                <td>${pelicula.idDirectorNavigation.descripcion}</td>
                <td>${pelicula.duracion}</td>
                <td>${pelicula.idGeneroNavigation.descripcion}</td>
                <td>${pelicula.idEdadNavigation.clasificacion}</td>
                <td>${pelicula.descripcion}</td>
                <td>${pelicula.estreno ? 'Sí' : 'No'}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarPelicula(${pelicula.idPelicula})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarPelicula(${pelicula.idPelicula})">Remover</button>
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
        const response = await fetch(`http://localhost:5069/api/Cine/DeletePelicula/${idPelicula}`, {
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

async function agregarPelicula() {
    // Obtener valores del formulario
    const pelicula = {
        titulo: document.getElementById('titulo').value,
        idGenero: document.getElementById('SelectGenero').value,
        idEdad: document.getElementById('SelectEdad').value,
        duracion: document.getElementById('duracion').value,
        descripcion: document.getElementById('descripcion').value,
        idDirector: document.getElementById('SelectDirector').value,
        url: document.getElementById('url').value,
        estreno: document.getElementById('estreno').checked
    };

    console.log('Datos de la película:', pelicula);

    try {
        // Enviar solicitud POST al endpoint de agregar película
        const response = await fetch('http://localhost:5069/api/Cine/RegistrarPelicula', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pelicula)
        });

        // Si la respuesta no es exitosa, lanzar un error
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error en la respuesta:', errorData);
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
        // Realiza una solicitud fetch a la API para obtener las películas
        const response = await fetch('http://localhost:5069/api/Cine/GetPeliculas');
        // Verifica si la respuesta no es correcta
        if (!response.ok) {
            throw new Error('Error al obtener las películas');
        }

        // Convierte la respuesta a formato JSON
        const peliculas = await response.json();

        // Retorna las películas obtenidas
        return peliculas;
    } catch (error) {
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
    contenedor.innerHTML = '';

    // Itera sobre cada película obtenida
    peliculas.forEach(pelicula => {
        // Crea un nuevo elemento div para la tarjeta de la película
        const tarjeta = document.createElement('div');

        // Asigna las clases 'card' y 'tarjeta-pelicula' al div
        tarjeta.className = 'card tarjeta-pelicula';

        // Define el contenido HTML de la tarjeta
        tarjeta.innerHTML = `
            <div class="card-img-container">
                <img src="${pelicula.url}" class="card-img-top" alt="${pelicula.titulo}">
            </div>
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

// Función para cargar los elementos del select de géneros
async function CargarGeneros() {
    try {
        console.log('Cargando géneros...');
        const response = await fetch('http://localhost:5069/api/Cine/GetGeneros');
        if (!response.ok) {
            throw new Error('Error al obtener los géneros');
        }
        const generos = await response.json();
        console.log('Géneros obtenidos:', generos);
        const selectGenero = document.getElementById('SelectGenero');
        if (!selectGenero) {
            throw new Error('Elemento selectGenero no encontrado');
        }
        selectGenero.innerHTML = '';
        const optionDefault = document.createElement('option');
        optionDefault.value = '';
        optionDefault.textContent = 'Seleccione un género';
        selectGenero.appendChild(optionDefault);
        generos.forEach(genero => {
            const option = document.createElement('option');
            option.value = genero.idGenero;
            option.textContent = genero.descripcion;
            selectGenero.appendChild(option);
        });
        console.log('Géneros cargados en el select');
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para cargar los elementos del select de edades
async function CargarEdades() {
    try {
        console.log('Cargando edades...');
        const response = await fetch('http://localhost:5069/api/Cine/GetEdades');
        if (!response.ok) {
            throw new Error('Error al obtener las edades');
        }
        const edades = await response.json();
        console.log('Edades obtenidas:', edades);
        const selectEdad = document.getElementById('SelectEdad');
        if (!selectEdad) {
            throw new Error('Elemento selectEdad no encontrado');
        }
        selectEdad.innerHTML = '';
        const optionDefault = document.createElement('option');
        optionDefault.value = '';
        optionDefault.textContent = 'Seleccione una edad';
        selectEdad.appendChild(optionDefault);
        edades.forEach(edad => {
            const option = document.createElement('option');
            option.value = edad.idEdad;
            option.textContent = edad.clasificacion;
            selectEdad.appendChild(option);
        });
        console.log('Edades cargadas en el select');
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para cargar los elementos del select de directores
async function CargarDirectores() {
    try {
        console.log('Cargando directores...');
        const response = await fetch('http://localhost:5069/api/Cine/GetDirectores');
        if (!response.ok) {
            throw new Error('Error al obtener los directores');
        }
        const directores = await response.json();
        console.log('Directores obtenidos:', directores);
        const selectDirector = document.getElementById('SelectDirector');
        if (!selectDirector) {
            throw new Error('Elemento selectDirector no encontrado');
        }
        selectDirector.innerHTML = '';
        const optionDefault = document.createElement('option');
        optionDefault.value = '';
        optionDefault.textContent = 'Seleccione un director';
        selectDirector.appendChild(optionDefault);
        directores.forEach(director => {
            const option = document.createElement('option');
            option.value = director.idDirector;
            option.textContent = director.descripcion;
            selectDirector.appendChild(option);
        });
        console.log('Directores cargados en el select');
    } catch (error) {
        console.error('Error:', error);
    }
}