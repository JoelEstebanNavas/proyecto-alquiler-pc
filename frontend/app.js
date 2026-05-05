const URL = "http://localhost:8080/api/componentes";
const AUTH_URL = "http://localhost:8080/api/auth";

window.onload = function() {
    if (document.getElementById("lista")) {
        cargar();
    }
};

function cargar() {
    fetch(URL)
        .then(response => response.json())
        .then(data => {
            const lista = document.getElementById("lista");
            lista.innerHTML = "";

            data.forEach(c => {
                const li = document.createElement("li");
                li.textContent = `${c.nombre} - ${c.tipo} (${c.estado})`;
                lista.appendChild(li);
            });
        })
        .catch(error => console.error("Error al cargar:", error));
}

function guardar() {
    const nombre = document.getElementById("nombre").value;
    const tipo = document.getElementById("tipo").value;
    const estado = document.getElementById("estado").value;

    if (!nombre || !tipo || !estado) {
        alert("Rellena todos los campos");
        return;
    }

    fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre: nombre,
            tipo: tipo,
            estado: estado
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al guardar");
        }
        return response.json();
    })
    .then(() => {
        limpiarFormulario();
        cargar();
    })
    .catch(error => {
        console.error("Error:", error);
        alert("No se pudo guardar");
    });
}

function limpiarFormulario() {
    document.getElementById("nombre").value = "";
    document.getElementById("tipo").value = "";
    document.getElementById("estado").value = "";
}

function login() {
    const email = document.getElementById("email")?.value?.trim();
    const password = document.getElementById("password")?.value?.trim();
    const mensaje = document.getElementById("mensajeLogin");

    if (!email || !password) {
        if (mensaje) {
            mensaje.textContent = "Rellena email y contrasena";
        }
        return;
    }

    fetch(`${AUTH_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                const detalle = text || `Error ${response.status}`;
                throw new Error(detalle);
            });
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem("usuarioActivo", JSON.stringify(data.usuario));

        if (mensaje) {
            mensaje.textContent = `Bienvenido ${data.usuario.nombre}`;
        }

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    })
    .catch(error => {
        if (mensaje) {
            if (error.message.includes("Failed to fetch")) {
                mensaje.textContent = "No se pudo conectar con el backend en localhost:8080";
            } else {
                mensaje.textContent = error.message;
            }
        }
    });
}
