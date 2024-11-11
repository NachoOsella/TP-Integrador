// funcion para cargar un archivo html dinamicamente pasandole la url y las funciones que se quieran ejecutar
function cargar_vista(url, ...callbacks) { // los tres puntos guardan los callbacks en un array
    fetch(url)
        .then((res) => res.text())
        .then((txt) => {
            const $panel_content = document.getElementById('dynamic-content');
            $panel_content.innerHTML = txt;

            // recorrer el array de callbacks y ejecutar cada uno si es una función
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
            cargar_vista('consultar.html', mostrarPeliculas);
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
        cargar_vista('alta.html', mostrarPeliculas);

    } catch (error) {
        console.error('Error:', error);
        alert('Error al agregar la película');
    }
}

// Función para editar los datos de una película
async function editarPelicula(id) {
    try {
        // Obtener datos de la película desde la API
        const response = await fetch(`http://localhost:5069/api/Cine/GetPelicula/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener los datos de la película');
        }
        const peli = await response.json();
        console.log('Película a editar:', peli);

        // Cargar la vista de modificación
        cargar_vista('modificacion.html', CargarDirectores, CargarEdades, CargarGeneros, () => {
            // Rellenar los campos con los datos actuales
            document.getElementById('titulo').value = peli.titulo;
            document.getElementById('SelectGenero').value = peli.idGenero;
            document.getElementById('SelectEdad').value = peli.idEdad;
            document.getElementById('duracion').value = peli.duracion;
            document.getElementById('descripcion').value = peli.descripcion;
            document.getElementById('SelectDirector').value = peli.idDirector;
            document.getElementById('url').value = peli.url;

            // Evento para guardar los cambios
            document.getElementById('guardar').onclick = async function () {
                const updatedPeli = {
                    titulo: document.getElementById('titulo').value,
                    idGenero: document.getElementById('SelectGenero').value,
                    idEdad: document.getElementById('SelectEdad').value,
                    duracion: document.getElementById('duracion').value,
                    descripcion: document.getElementById('descripcion').value,
                    idDirector: document.getElementById('SelectDirector').value,
                    url: document.getElementById('url').value
                };

                // Enviar los datos actualizados a la API
                const result = await fetch(`http://localhost:5069/api/Cine/PutPelicula/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedPeli)
                });

                if (result.ok) {
                    alert('Película actualizada correctamente');
                    // Actualizar la lista de películas
                    cargar_vista('consultar.html', mostrarPeliculas);
                } else {
                    alert('Error al actualizar la película.');
                }
            };
        });
    } catch (error) {
        console.error("Error al editar la película:", error);
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
        // Realiza una solicitud a la API para obtener los géneros
        const response = await fetch('http://localhost:5069/api/Cine/GetGeneros');
        if (!response.ok) {
            throw new Error('Error al obtener los géneros');
        }
        // Convierte la respuesta a JSON
        const generos = await response.json();
        // Obtiene el elemento select del DOM
        const selectGenero = document.getElementById('SelectGenero');
        if (!selectGenero) {
            throw new Error('Elemento selectGenero no encontrado');
        }
        // Limpia las opciones existentes en el select
        selectGenero.innerHTML = '';
        // Añade una opción por defecto
        const optionDefault = document.createElement('option');
        optionDefault.value = '';
        optionDefault.textContent = 'Seleccione un género';
        selectGenero.appendChild(optionDefault);
        // Itera sobre los géneros obtenidos y añade cada uno como una opción en el select
        generos.forEach(genero => {
            const option = document.createElement('option');
            option.value = genero.idGenero;
            option.textContent = genero.descripcion;
            selectGenero.appendChild(option);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para cargar los elementos del select de edades
async function CargarEdades() {
    try {
        // Realiza una solicitud a la API para obtener las edades
        const response = await fetch('http://localhost:5069/api/Cine/GetEdades');
        if (!response.ok) {
            throw new Error('Error al obtener las edades');
        }
        // Convierte la respuesta a JSON
        const edades = await response.json();
        // Obtiene el elemento select del DOM
        const selectEdad = document.getElementById('SelectEdad');
        if (!selectEdad) {
            throw new Error('Elemento selectEdad no encontrado');
        }
        // Limpia las opciones existentes en el select
        selectEdad.innerHTML = '';
        // Añade una opción por defecto
        const optionDefault = document.createElement('option');
        optionDefault.value = '';
        optionDefault.textContent = 'Seleccione una edad';
        selectEdad.appendChild(optionDefault);
        // Itera sobre las edades obtenidas y añade cada una como una opción en el select
        edades.forEach(edad => {
            const option = document.createElement('option');
            option.value = edad.idEdad;
            option.textContent = edad.clasificacion;
            selectEdad.appendChild(option);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para cargar los elementos del select de directores
async function CargarDirectores() {
    try {
        // Realiza una solicitud a la API para obtener los directores
        const response = await fetch('http://localhost:5069/api/Cine/GetDirectores');
        if (!response.ok) {
            throw new Error('Error al obtener los directores');
        }
        // Convierte la respuesta a JSON
        const directores = await response.json();
        // Obtiene el elemento select del DOM
        const selectDirector = document.getElementById('SelectDirector');
        if (!selectDirector) {
            throw new Error('Elemento selectDirector no encontrado');
        }
        // Limpia las opciones existentes en el select
        selectDirector.innerHTML = '';
        // Añade una opción por defecto
        const optionDefault = document.createElement('option');
        optionDefault.value = '';
        optionDefault.textContent = 'Seleccione un director';
        selectDirector.appendChild(optionDefault);
        // Itera sobre los directores obtenidos y añade cada uno como una opción en el select
        directores.forEach(director => {
            const option = document.createElement('option');
            option.value = director.idDirector;
            option.textContent = director.descripcion;
            selectDirector.appendChild(option);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}