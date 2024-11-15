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

            // Funcion para cargar las salas en el select
            async function CargarSalas() {
                try {
                    const response = await fetch('http://localhost:5069/api/Cine/GetSalas');
                    if (!response.ok) {
                        throw new Error('Error al obtener las salas');
                    }
                    const salas = await response.json();
                    const selectSala = document.getElementById('nroSala');
                    if (!selectSala) {
                        throw new Error('Elemento selectSala no encontrado');
                    }
                    selectSala.innerHTML = '';
                    const optionDefault = document.createElement('option');
                    optionDefault.value = '';
                    optionDefault.textContent = 'Seleccione una sala';
                    selectSala.appendChild(optionDefault);
                    salas.forEach(sala => {
                        const option = document.createElement('option');
                        option.value = sala.nroSala;
                        option.textContent = sala.nroSala;
                        selectSala.appendChild(option);
                    });
                } catch (error) {
                    console.error('Error:', error);
                }
            }
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

async function venderTicket(idPelicula) {
    // Cargar la vista del formulario de transacción
    cargar_vista('transaccionxpelicula.html', async () => {
        await CargarFunciones(idPelicula);
        await CargarMetodosDePago();
        await CargarPromos();

        // Obtener detalles de la película seleccionada
        const pelicula = await obtenerPeliculaPorId(idPelicula);

        // Rellenar los campos con la información de la película
        document.getElementById('movieName').value = pelicula.titulo;

        // Cargar la imagen y la descripción de la película
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
                idCliente: 1, // Asignar el ID del cliente según corresponda
                idFormaDePago: parseInt(document.getElementById('paymentMethod').value),
                montoBase: parseFloat(document.getElementById('Price').value),
                codPromocion: parseInt(document.getElementById('promoCode').value),
                nroFuncion: parseInt(document.getElementById('showNumber').value),
                cantidadButacas: parseInt(document.getElementById('ticketQuantity').value)
            };

            try {
                // Enviar los datos a la API
                const response = await fetch('http://localhost:5069/api/Peliculas/facturar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(transaccion)
                });

                if (response.ok) {
                    const data = await response.json();
                    // Guardar los datos del ticket para usarlos en ticket.html
                    const urlParams = new URLSearchParams({
                        movieName: pelicula.titulo,
                        paymentMethod: document.getElementById('paymentMethod').selectedOptions[0].text,
                        price: document.getElementById('Price').value,
                        promoCode: document.getElementById('promoCode').selectedOptions[0].text,
                        showNumber: document.getElementById('showNumber').selectedOptions[0].text,
                        quantity: transaccion.cantidadButacas,
                        totalPrice: data.montoTotal // Utilizar el monto total devuelto por el POST
                    });
                    // Abrir la página de ticket.html con los datos de la transacción
                    window.open(`ticket.html?${urlParams.toString()}`, '_blank');
                } else {
                    const errorData = await response.json();
                    console.error('Error al realizar la transacción:', errorData);
                    alert('Error al realizar la venta, Verifique que la cantidad de butacas no sea superior a la disponible');
                }
            } catch (error) {
                if (error instanceof SyntaxError) {
                    alert('Error al realizar la venta, Verifique que la cantidad de butacas no sea superior a la disponible');
                } else {
                    console.error('Error al realizar la transacción:', error);
                    alert('Error al realizar la transacción: ' + error.message);
                }
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
async function CargarFunciones(idPelicula) {
    try {
        const response = await fetch(`http://localhost:5069/api/Peliculas/${idPelicula}/funciones-disponibles`);
        console.log('Response status:', response.status); // Agregado para depuración
        if (!response.ok) {
            throw new Error("Error al obtener los números de función");
        }

        const numerosDeFuncion = await response.json();
        console.log('Response data:', numerosDeFuncion); // Agregado para depuración
        const selectNumeroDeFuncion = document.getElementById("showNumber");

        selectNumeroDeFuncion.innerHTML = "";

        const opcionPorDefecto = document.createElement("option");
        opcionPorDefecto.value = "";
        opcionPorDefecto.textContent = "Seleccione un número de función";
        selectNumeroDeFuncion.appendChild(opcionPorDefecto);

        numerosDeFuncion.forEach(funcion => {
            const opcion = document.createElement("option");
            opcion.value = funcion.nroFuncion;

            // Crear objetos Date a partir de 'funcion.dia' y 'funcion.hora'
            const fechaDia = new Date(funcion.dia);
            const fechaHora = new Date(funcion.hora);

            // Formatear la fecha en formato legible (DD/MM/YYYY)
            const opcionesFecha = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            };
            const fechaFormateada = fechaDia.toLocaleDateString('es-AR', opcionesFecha);

            // Formatear la hora en formato legible (HH:mm)
            const opcionesHora = {
                hour: '2-digit',
                minute: '2-digit'
            };
            const horaFormateada = fechaHora.toLocaleTimeString('es-AR', opcionesHora);

            // Combinar fecha y hora en el texto de la opción
            opcion.textContent = `Función ${funcion.nroFuncion} - ${fechaFormateada} ${horaFormateada}`;
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


// Función para mostrar las películas más vendidas
async function mostrarPeliculasMasVendidas() {
    try {
        const response = await fetch('http://localhost:5069/api/Peliculas/butacas-vendidas');
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }
        const data = await response.json();
        const peliculasLimitadas = data.slice(0, 10);

        const tbody = document.getElementById('tbodyMasVendidas');
        tbody.innerHTML = '';

        peliculasLimitadas.forEach(pelicula => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${pelicula.url}" style="width: 50px;"></td>
                <td>${pelicula.pelicula}</td>
                <td>${pelicula.butacasVendidas}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al mostrar las películas más vendidas:', error);
    }
}


// Funcion para mostrar todas las peliculas en un select
async function mostrarPeliculasSelect() {
    try {
        const response = await fetch('http://localhost:5069/api/Cine/GetPeliculas');
        if (!response.ok) {
            throw new Error('Error en la solicitud: ' + response.statusText);
        }
        const data = await response.json();

        const selectPeliculas = document.getElementById('SelectPelicula');
        selectPeliculas.innerHTML = '';

        const optionDefault = document.createElement('option');
        optionDefault.value = '';
        optionDefault.textContent = 'Seleccione una película';
        selectPeliculas.appendChild(optionDefault);

        data.forEach(pelicula => {
            const option = document.createElement('option');
            option.value = pelicula.idPelicula;
            option.textContent = pelicula.titulo;
            selectPeliculas.appendChild(option);
        });
    } catch (error) {
        console.error('Error al mostrar las películas:', error);
    }
}

// Función para agregar una nueva función
async function agregarFuncion() {
    const diaInput = document.getElementById('dia').value;
    const horaInput = document.getElementById('hora').value;

    // Añadir segundos para completar el formato
    const horaCompleta = `${horaInput}:00`; // '14:30:00'

    // Combinar fecha y hora completa
    const diaHoraString = `${diaInput}T${horaCompleta}`;

    // Crear objeto Date a partir del string completo
    const diaHora = new Date(diaHoraString);

    // Ajustar la hora manualmente para evitar la conversión de zona horaria
    diaHora.setHours(diaHora.getHours() - diaHora.getTimezoneOffset() / 60);

    // Verificar si la fecha es válida
    if (isNaN(diaHora.getTime())) {
        alert('Fecha y hora inválidas. Por favor verifica los campos.');
        return;
    }

    // Convertir a formato ISO
    const diaHoraISO = diaHora.toISOString();

    const funcion = {
        dia: diaHoraISO,
        hora: diaHoraISO, // Si 'hora' espera el mismo valor
        idPelicula: parseInt(document.getElementById('SelectPelicula').value),
        nroSala: parseInt(document.getElementById('SelectSala').value),
        capacidad: parseInt(document.getElementById('capacidad').value)
    };

    try {
        const response = await fetch('http://localhost:5069/api/Peliculas/agregar-funcion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(funcion)
        });

        if (!response.ok) {
            throw new Error('Error al agregar la función');
        }
        // Recargar la página para mostrar la nueva función

        alert('Función agregada exitosamente');
        location.reload();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al agregar la función');
    }
}

// Función para cargar las salas en el select
async function CargarSalas() {
    try {
        const response = await fetch(`http://localhost:5069/api/Peliculas/sucursales/${1}/salas`);
        if (!response.ok) {
            throw new Error('Error al obtener las salas');
        }
        const salas = await response.json();
        const selectSala = document.getElementById('SelectSala');
        if (!selectSala) {
            throw new Error('Elemento selectSala no encontrado');
        }
        selectSala.innerHTML = '';
        const optionDefault = document.createElement('option');
        optionDefault.value = '';
        optionDefault.textContent = 'Seleccione una sala';
        selectSala.appendChild(optionDefault);
        salas.forEach(sala => {
            const option = document.createElement('option');
            option.value = sala.nroSala;
            option.textContent = sala.nroSala;
            selectSala.appendChild(option);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}