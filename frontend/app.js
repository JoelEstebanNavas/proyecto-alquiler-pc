const URL = "http://localhost:8080/api/componentes";
const AUTH_URL = "http://localhost:8080/api/auth";
const ALQUILER_URL = "http://localhost:8080/api/alquileres";

window.onload = function() {
    if (document.getElementById("lista")) {
        configurarVistaPorRol();
        cargar();
    }
};

function obtenerUsuarioActivo() {
    const usuario = localStorage.getItem("usuarioActivo");
    return usuario ? JSON.parse(usuario) : null;
}

function configurarVistaPorRol() {
    const usuario = obtenerUsuarioActivo();
    const bloqueAdmin = document.getElementById("bloqueAdmin");
    const mensajeRol = document.getElementById("mensajeRol");
    const usuarioInfo = document.getElementById("usuarioInfo");

    if (usuarioInfo) {
        usuarioInfo.textContent = usuario
            ? `${usuario.nombre} - ${usuario.rol}`
            : "Invitado - sin sesion iniciada";
    }

    if (!usuario) {
        if (bloqueAdmin) {
            bloqueAdmin.style.display = "none";
        }
        if (mensajeRol) {
            mensajeRol.textContent = "Inicia sesion para gestionar o alquilar componentes.";
        }
        return;
    }

    if (usuario.rol === "ADMIN") {
        if (bloqueAdmin) {
            bloqueAdmin.style.display = "block";
        }
        if (mensajeRol) {
            mensajeRol.textContent = "Modo administrador: puedes anadir componentes y consultar el catalogo.";
        }
    } else {
        if (bloqueAdmin) {
            bloqueAdmin.style.display = "none";
        }
        if (mensajeRol) {
            mensajeRol.textContent = "Modo usuario: puedes ver y alquilar componentes disponibles.";
        }
    }
}

function cargar() {
    fetch(URL)
        .then(response => response.json())
        .then(data => {
            const lista = document.getElementById("lista");
            lista.innerHTML = "";
            const usuario = obtenerUsuarioActivo();

            data.forEach(c => {
                const li = document.createElement("li");
                li.className = "item-card";

                const info = document.createElement("div");
                info.className = "item-info";
                info.innerHTML = `
                    <strong>${c.nombre}</strong>
                    <span>${c.tipo}</span>
                    <span class="badge ${c.estado.toLowerCase()}">${c.estado}</span>
                `;
                li.appendChild(info);

                if (usuario && usuario.rol === "USER" && c.estado === "Disponible") {
                    const boton = document.createElement("button");
                    boton.type = "button";
                    boton.className = "rent-button";
                    boton.textContent = "Alquilar";
                    boton.onclick = function() {
                        alquilarComponente(c.id);
                    };
                    li.appendChild(boton);
                }

                lista.appendChild(li);
            });
        })
        .catch(error => console.error("Error al cargar:", error));
}

function guardar() {
    const usuario = obtenerUsuarioActivo();
    const nombre = document.getElementById("nombre").value;
    const tipo = document.getElementById("tipo").value;
    const estado = document.getElementById("estado").value;

    if (!usuario || usuario.rol !== "ADMIN") {
        alert("Solo un administrador puede anadir componentes");
        return;
    }

    if (!nombre || !tipo || !estado) {
        alert("Rellena todos los campos");
        return;
    }

    fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-User-Role": usuario.rol
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

function alquilarComponente(componenteId) {
    const usuario = obtenerUsuarioActivo();

    if (!usuario || usuario.rol !== "USER") {
        alert("Solo un usuario puede alquilar componentes");
        return;
    }

    fetch(`${ALQUILER_URL}/crear`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            usuarioId: usuario.id,
            componenteId: componenteId
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(text || "No se pudo realizar el alquiler");
            });
        }
        return response.json();
    })
    .then(data => {
        alert(data.mensaje);
        cargar();
    })
    .catch(error => {
        alert(error.message);
    });
}

function cerrarSesion() {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "login.html";
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
