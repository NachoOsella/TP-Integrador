document.addEventListener('DOMContentLoaded', function () {
    // Obtener el ID de la película de la URL
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get('id');

    // Datos de ejemplo de películas (normalmente esto vendría de una API)
    const movieData = {
        1: { title: "TERRIFIER 3", description: "Una película de terror aterradora.", image: "../img/t3.jpeg", pricePerTicket: 10 },
        2: { title: "Los Domingos Mueren Más Personas", description: "Un drama de misterio.", image: "../img/domingos.jpeg", pricePerTicket: 12 },
        3: { title: "No Te Sueltes", description: "Una película de acción emocionante.", image: "../img/nts.jpeg", pricePerTicket: 8 },
        4: { title: "Norita", description: "Una comedia romántica.", image: "../img/norita.jpeg", pricePerTicket: 7 }
    };

    // Cargar detalles de la película dinámicamente
    if (movieData[movieId]) {
        const movie = movieData[movieId];

        // Establecer el título y la descripción de la película
        document.getElementById('movieTitle').innerText = movie.title;
        document.getElementById('movieDescription').innerText = movie.description;
        document.getElementById('movieName').value = movie.title;

        // Establecer la imagen de la película como fondo
        document.getElementById('movieImage').innerHTML = `<img src="${movie.image}" alt="${movie.title}">`;

        // Almacenar el precio por boleto de la película (para el cálculo)
        const pricePerTicket = movie.pricePerTicket;

        // Calcular el precio total cada vez que cambia la cantidad de boletos
        document.getElementById('ticketQuantity').addEventListener('input', function () {
            const quantity = parseInt(this.value);
            const totalPriceField = document.getElementById('totalPrice');

            // Verificar si la cantidad es válida
            if (quantity && quantity > 0) {
                const totalPrice = quantity * pricePerTicket;
                totalPriceField.value = `$${totalPrice.toFixed(2)}`; // Formatear como moneda
            } else {
                totalPriceField.value = '';
            }
        });
    }
});
