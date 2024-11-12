// Función para cargar un archivo HTML con la URL y las funciones que quieras ejecutar después
function cargar_vista(url, ...callbacks) { // Los tres puntos guardan las funciones en un array
    fetch(url)
        .then((res) => res.text())
        .then((txt) => {
            const $panel_content = document.getElementById('dynamic-content');
            $panel_content.innerHTML = txt;

            // Ejecutar cada función del array si es una función
            callbacks.forEach(callback => {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        })
        .catch((error) => console.error('Error al cargar la vista:', error));
}

// Función para mostrar las películas
async function mostrarPeliculas() {
    try {
        const response = await fetch('http://localhost:5069/api/Cine/GetPeliculas');
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }

        const data = await response.json();

        // Obtener la tabla de películas y limpiar el contenido existente
        const tbody = document.getElementById('tbody');
        tbody.innerHTML = '';

        // Agregar cada película a la tabla (sin mostrar el id)
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

// Función para eliminar una película
async function eliminarPelicula(idPelicula) {
    // Confirmar si el usuario quiere eliminar la película
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta película?');
    if (!confirmacion) {
        return;
    }
    try {
        const response = await fetch(`http://localhost:5069/api/Cine/DeletePelicula/${idPelicula}`, {
            method: 'DELETE'
        });
        console.log(response);

        if (response.ok) {
            cargar_vista('consultar.html', mostrarPeliculas);
        } else {
            console.error('Error al eliminar la película');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para agregar una película
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
        const response = await fetch('http://localhost:5069/api/Cine/RegistrarPelicula', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pelicula)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error en la respuesta:', errorData);
            throw new Error('Error al agregar la película');
        }

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
        const response = await fetch(`http://localhost:5069/api/Cine/GetPelicula/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener los datos de la película');
        }
        const peli = await response.json();
        console.log('Película a editar:', peli);

        // Cargar la vista de modificación
        cargar_vista('modificacion.html', async () => {
            // Cargar funciones para los select
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
        const response = await fetch('http://localhost:5069/api/Cine/GetPeliculas');
        if (!response.ok) {
            throw new Error('Error al obtener las películas');
        }
        const peliculas = await response.json();

        // Retorna las peliculas obtenidas
        return peliculas;
    } catch (error) {
        console.error('Error:', error);
        // Retorna un arreglo vacio en caso de error
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
        const response = await fetch('http://localhost:5069/api/Cine/GetGeneros');
        if (!response.ok) {
            throw new Error('Error al obtener los géneros');
        }
        const generos = await response.json();
        // Obtiene el elemento select del DOM
        const selectGenero = document.getElementById('SelectGenero');
        if (!selectGenero) {
            throw new Error('Elemento selectGenero no encontrado');
        }
        // Limpia las opciones existentes en el select
        selectGenero.innerHTML = '';
        // Añade la opción por defecto
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
        const response = await fetch('http://localhost:5069/api/Cine/GetEdades');
        if (!response.ok) {
            throw new Error('Error al obtener las edades');
        }
        const edades = await response.json();
        // Obtiene el elemento select del DOM
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
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para cargar los elementos del select de directores
async function CargarDirectores() {
    try {
        const response = await fetch('http://localhost:5069/api/Cine/GetDirectores');
        if (!response.ok) {
            throw new Error('Error al obtener los directores');
        }
        const directores = await response.json();
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
    } catch (error) {
        console.error('Error:', error);
    }
}



// Función para calcular el monto final
function calcularMontoFinal() {
    const ticketQuantity = parseInt(document.getElementById('ticketQuantity').value);
    const pricePerTicket = parseFloat(document.getElementById('Price').value);
    const totalPrice = ticketQuantity * pricePerTicket;
    document.getElementById('totalPrice').value = totalPrice.toFixed(2);
}

// Modificar la función venderTicket
async function venderTicket(idPelicula) {
    // Cargar la vista del formulario de transacción
    cargar_vista('transaccionxpelicula.html', async () => {
        await CargarFunciones();
        await CargarMetodosDePago();
        await CargarPromos();

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

        // Configurar el evento de cambio en la cantidad de boletos
        document.getElementById('ticketQuantity').addEventListener('input', calcularMontoFinal);
        document.getElementById('Price').addEventListener('input', calcularMontoFinal);

        // Configurar el evento de envío del formulario
        document.getElementById('transactionForm').addEventListener('submit', async function (event) {
            event.preventDefault();

            // Obtener datos del formulario
            const transaccion = {
                monto: document.getElementById('totalPrice').value, // Usar el monto total calculado
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
                // Enviar los datos obtenidos del formulario a la API
                const response = await fetch('http://localhost:5069/api/Ticket/RegistrarTransaccion', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(transaccion)
                });

                if (response.ok) {
                    // Guardar los datos de ticket en la url para usarlos en la página de ticket.html
                    const urlParams = new URLSearchParams({
                        movieName: pelicula.titulo,
                        paymentMethod: document.getElementById('paymentMethod').selectedOptions[0].text,
                        price: document.getElementById('Price').value,
                        promoCode: document.getElementById('promoCode').selectedOptions[0].text,
                        showNumber: document.getElementById('showNumber').selectedOptions[0].text,
                        quantity: document.getElementById('ticketQuantity').value,
                        totalPrice: document.getElementById('totalPrice').value
                    });
                    // Abrir página de ticket.html con los datos de la transacción
                    window.open(`ticket.html?${urlParams.toString()}`, '_blank');
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

// Función para cargar formas de pago desde la API
async function CargarMetodosDePago() {
    try {
        const response = await fetch('http://localhost:5069/api/Ticket/GetAllFormasDePago');
        if (!response.ok) {
            throw new Error("Error al obtener las formas de pago");
        }

        const formasDePago = await response.json();
        const selectFormaDePago = document.getElementById("paymentMethod");

        selectFormaDePago.innerHTML = "";

        const opcionPorDefecto = document.createElement("option");
        opcionPorDefecto.value = "";
        opcionPorDefecto.textContent = "Seleccione una forma de pago";
        selectFormaDePago.appendChild(opcionPorDefecto);

        formasDePago.forEach(forma => {
            const opcion = document.createElement("option");
            opcion.value = forma.idFormaDePago;
            opcion.textContent = forma.descripcion;
            selectFormaDePago.appendChild(opcion);
        });
    } catch (error) {
        console.error("Error al cargar las formas de pago:", error);
    }
}

// Función para cargar números de función desde la API
async function CargarFunciones() {
    try {
        const response = await fetch('http://localhost:5069/api/Cine/GetFunciones');
        if (!response.ok) {
            throw new Error("Error al obtener los números de función");
        }

        const numerosDeFuncion = await response.json();
        const selectNumeroDeFuncion = document.getElementById("showNumber");

        selectNumeroDeFuncion.innerHTML = "";

        const opcionPorDefecto = document.createElement("option");
        opcionPorDefecto.value = "";
        opcionPorDefecto.textContent = "Seleccione un número de función";
        selectNumeroDeFuncion.appendChild(opcionPorDefecto);

        numerosDeFuncion.forEach(funcion => {
            const opcion = document.createElement("option");
            opcion.value = funcion.nroFuncion;
            opcion.textContent = funcion.dia;
            selectNumeroDeFuncion.appendChild(opcion);
        });
    } catch (error) {
        console.error("Error al cargar los números de función:", error);
    }
}

// Función para cargar códigos de promoción desde la API
async function CargarPromos() {
    try {
        const response = await fetch('http://localhost:5069/api/Ticket/GetAllPromociones');
        if (!response.ok) {
            throw new Error("Error al obtener los códigos de promoción");
        }

        const codigosDePromocion = await response.json();
        const selectCodigoDePromocion = document.getElementById("promoCode");

        selectCodigoDePromocion.innerHTML = "";

        const opcionPorDefecto = document.createElement("option");
        opcionPorDefecto.value = "";
        opcionPorDefecto.textContent = "Seleccione un código de promoción";
        selectCodigoDePromocion.appendChild(opcionPorDefecto);

        codigosDePromocion.forEach(codigo => {
            const opcion = document.createElement("option");
            opcion.value = codigo.codPromocion;
            opcion.textContent = codigo.descripcion;
            selectCodigoDePromocion.appendChild(opcion);
        });
    } catch (error) {
        console.error("Error al cargar los códigos de promoción:", error);
    }
}


