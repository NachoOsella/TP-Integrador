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

const data = [
    { id: 1, titulo: 'Pelicula 1', director: 'Director 1', anio: 2021, genero: 'Acción' },
    { id: 2, titulo: 'Pelicula 2', director: 'Director 2', anio: 2020, genero: 'Comedia' },
    { id: 3, titulo: 'Pelicula 3', director: 'Director 3', anio: 2019, genero: 'Drama' }
];

function mostrarPeliculas() {
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

// al apretar el boton editar te redirecciona a modificacion.html
function editar_Pelicula(id) {
    window.location.href = `modificacion.html?id=${id}`;
}

// logica de edicion de peliculas
async function editarPelicula(id) {
    try {
        // Buscar la película en los datos globales
        const peli = data.find(p => p.id === id);
        if (!peli) {
            throw new Error('Película no encontrada');
        }
        console.log(peli);
        cargar_vista('modificacion.html', () => {
            console.log(peli);
            const $titulo = document.getElementById('titulo');
            const $año = document.getElementById('año');
            const $director = document.getElementById('director');
            const $genero = document.getElementById('genero');

            // Asignar los valores encontrados a los elementos del DOM
            $titulo.value = peli.titulo;
            $año.value = peli.año;
            $director.value = peli.director;
            $genero.value = peli.genero;

            // Completar evento onClick del Guardar y llamar al PUT para hacer el update
            document.getElementById('guardar').onclick = function () {
                // Simulación de la actualización de la película
                const updatedPeli = {
                    titulo: $titulo.value,
                    año: $año.value,
                    director: $director.value,
                    genero: $genero.value
                };
                console.log("Película actualizada:", updatedPeli);
                alert('Película actualizada correctamente');
            };
        });
    } catch (error) {
        console.error("Error al registrar la baja de película:", error);
    }
}

function eliminarPelicula(id) {
    // si confirma
    if (confirm('¿Estás seguro de eliminar esta película?')) {
        fetch(`/api/peliculas/${id}`, { method: 'DELETE' }) // uso el metodo DELETE
            .then(res => {
                if (res.ok) {
                    mostrarPeliculas(); // Actualizar la tabla
                } else {
                    alert('Error al eliminar la película.');
                }
            })
            .catch(err => console.error('Error:', err));
    }
}