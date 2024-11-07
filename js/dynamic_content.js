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

        // Iterar sobre las películas y agregarlas a la tabla(sin mostrar el id)
        data.forEach(pelicula => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="display: none;">${pelicula.idPelicula}</td>
                <td>${pelicula.titulo}</td>
                <td>${pelicula.idDirector}</td>
                <td>${pelicula.duracion}</td>
                <td>${pelicula.idGenero}</td>
                <td>${pelicula.idEdad}</td>
                <td>${pelicula.descripcion}</td>
                <td>${pelicula.estreno ? 'Sí' : 'No'}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarPelicula(${pelicula.idPelicula})",>Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarPelicula(${pelicula.idPelicula})">Eliminar</button>
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
        const response = await fetch(`http://localhost:5171/api/Cine/DeletePelicula/${idPelicula}`, {
            method: 'DELETE'
        });

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

        // Mostrar mensaje de éxito y redirigir a la página principal
        alert('Película agregada exitosamente');
        window.location.href = 'main.html';

    } catch (error) {
        console.error('Error:', error);
        alert('Error al agregar la película');
    }
}


// logica para editar una pelicula