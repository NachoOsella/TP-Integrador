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
                <td><img src="${pelicula.url}" style="width: 50px;"></td>
                <td>${pelicula.titulo}</td>
                <td>${pelicula.idDirectorNavigation.descripcion}</td>
                <td>${pelicula.duracion}</td>
                <td>${pelicula.idGeneroNavigation.descripcion}</td>
                <td>${pelicula.idEdadNavigation.clasificacion}</td>
                <td style="display: none;">${pelicula.descripcion}</td>
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

        // Mostrar mensaje de éxito y vacias el formulario
        alert('Película agregada exitosamente');
        document.getElementById('titulo').value = '';
        document.getElementById('duracion').value = '';
        document.getElementById('descripcion').value = '';
        document.getElementById('url').value = '';
        document.getElementById('estreno').checked = false;
        document.getElementById('SelectGenero').value = '';
        document.getElementById('SelectEdad').value = '';
        document.getElementById('SelectDirector').value = '';


    } catch (error) {
        console.error('Error:', error);
        alert('Error al agregar la película, Verifique que todos los campos estén llenos.');
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
        cargar_vista('modificacion.html', async () => {
            await CargarDirectores();
            await CargarEdades();
            await CargarGeneros();

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
                    alert('Error al actualizar la película, Cargue todos los campos.');
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



async function venderTicket(idPelicula) {
    // Cargar la vista del formulario de transacción
    cargar_vista('transaccionxpelicula.html', async () => {
        await loadPaymentMethods();
        await loadShowNumbers();
        await loadPromoCodes();

        // Obtener detalles de la película seleccionada
        const pelicula = await obtenerPeliculaPorId(idPelicula);

        // Rellenar los campos con la información de la película
        document.getElementById('movieName').value = pelicula.titulo;

        // Cargar en el div la imagen y la descripción de la película
        const img = document.createElement('img');
        img.src = pelicula.url;
        img.style.width = '300px';
        img.style.borderRadius = '30px';
        img.style.margin = '10px';
        document.getElementById('movieImage').appendChild(img);
        document.getElementById('movieDescription').textContent = pelicula.descripcion;

        // Configurar el evento de envío del formulario
        document.getElementById('transactionForm').addEventListener('submit', async function (event) {
            event.preventDefault();

            // Obtener datos del formulario
            const transaccion = {
                monto: document.getElementById('Price').value, // Asegúrate de que el valor sea una cadena que represente una cantidad de dinero
                idFormaDePago: parseInt(document.getElementById('paymentMethod').value),
                detalleFacturas: [
                    {
                        nroFuncion: parseInt(document.getElementById('showNumber').value),
                        codPromocion: parseInt(document.getElementById('promoCode').value)
                    }
                ]
            };
            console.log('Datos:', transaccion);

            try {
                // Enviar transacción al servidor
                const response = await fetch('http://localhost:5069/api/Ticket/RegistrarTransaccion', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(transaccion)
                });

                if (response.ok) {
                    alert('Transacción realizada con éxito');
                } else {
                    const errorData = await response.json();
                    console.error('Error al realizar la transacción:', errorData);
                    alert('Error al realizar la transacción: ' + JSON.stringify(errorData.errors));
                }
            } catch (error) {
                console.error('Error al realizar la transacción:', error);
                alert('Error al realizar la transacción: ' + error.message);
            }
        });
    });
}

// Función para obtener detalles de una película por ID
async function obtenerPeliculaPorId(idPelicula) {
    const response = await fetch(`http://localhost:5069/api/Cine/GetPelicula/${idPelicula}`);
    if (response.ok) {
        return await response.json();
    } else {
        throw new Error('Error al obtener la película');
    }
}

async function loadPaymentMethods() {
    try {
        const response = await fetch('http://localhost:5069/api/Ticket/GetAllFormasDePago');
        if (!response.ok) {
            throw new Error("Error al obtener las formas de pago");
        }

        const paymentMethods = await response.json();
        const paymentMethodSelect = document.getElementById("paymentMethod");

        // Limpiar las opciones actuales
        paymentMethodSelect.innerHTML = "";

        // Agregar opción por defecto
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Seleccione una forma de pago";
        paymentMethodSelect.appendChild(defaultOption);

        // Agregar una opción por cada método de pago obtenido de la API
        paymentMethods.forEach(method => {
            const option = document.createElement("option");
            option.value = method.idFormaDePago; // Asume que 'id' es el identificador del método de pago en la API
            option.textContent = method.descripcion;
            paymentMethodSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar las formas de pago:", error);
    }
}

// Función para cargar números de función desde la API
async function loadShowNumbers() {
    try {
        const response = await fetch('http://localhost:5069/api/Cine/GetFunciones');
        if (!response.ok) {
            throw new Error("Error al obtener los números de función");
        }

        const showNumbers = await response.json();
        const showNumberSelect = document.getElementById("showNumber");

        // Limpiar las opciones actuales
        showNumberSelect.innerHTML = "";

        // Agregar opción por defecto
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Seleccione un número de función";
        showNumberSelect.appendChild(defaultOption);

        // Agregar una opción por cada número de función obtenido de la API
        showNumbers.forEach(show => {
            const option = document.createElement("option");
            option.value = show.nroFuncion;
            option.textContent = show.dia;
            showNumberSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar los números de función:", error);
    }
}

// Función para cargar códigos de promoción desde la API
async function loadPromoCodes() {
    try {
        const response = await fetch('http://localhost:5069/api/Ticket/GetAllPromociones');
        if (!response.ok) {
            throw new Error("Error al obtener los códigos de promoción");
        }

        const promoCodes = await response.json();
        const promoCodeSelect = document.getElementById("promoCode");

        // Limpiar las opciones actuales
        promoCodeSelect.innerHTML = "";

        // Agregar opción por defecto
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Seleccione un código de promoción";
        promoCodeSelect.appendChild(defaultOption);

        // Agregar una opción por cada código de promoción obtenido de la API
        promoCodes.forEach(code => {
            const option = document.createElement("option");
            option.value = code.codPromocion; // Asume que 'id' es el identificador del código de promoción en la API
            option.textContent = code.descripcion; // Asume que 'code' es el código de promoción
            promoCodeSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar los códigos de promoción:", error);
    }
}




