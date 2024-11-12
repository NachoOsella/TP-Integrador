document.addEventListener("DOMContentLoaded", function () {
    loadPaymentMethods();
    loadShowNumbers();
    loadPromoCodes();
});

// Función para cargar formas de pago desde la API
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

        // Agregar una opción por cada método de pago obtenido de la API
        paymentMethods.forEach(method => {
            const option = document.createElement("option");
            option.value = method.id; // Asume que 'id' es el identificador del método de pago en la API
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

        // Agregar una opción por cada número de función obtenido de la API
        showNumbers.forEach(show => {
            const option = document.createElement("option");
            option.value = show.id; // Asume que 'id' es el identificador de la función en la API
            option.textContent = show.number; // Asume que 'number' es el número de función
            showNumberSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar los números de función:", error);
    }
}

// Función para cargar códigos de promoción desde la API
async function loadPromoCodes() {
    try {
        const response = await fetch('http://localhost:5069/api/Cine/GetAllPromociones');
        if (!response.ok) {
            throw new Error("Error al obtener los códigos de promoción");
        }

        const promoCodes = await response.json();
        const promoCodeSelect = document.getElementById("promoCode");

        // Limpiar las opciones actuales
        promoCodeSelect.innerHTML = "";

        // Agregar una opción por cada código de promoción obtenido de la API
        promoCodes.forEach(code => {
            const option = document.createElement("option");
            option.value = code.id; // Asume que 'id' es el identificador del código de promoción en la API
            option.textContent = code.code; // Asume que 'code' es el código de promoción
            promoCodeSelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar los códigos de promoción:", error);
    }
}


