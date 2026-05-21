const URL = "https://spirited-spontaneity-production.up.railway.app/api/componentes";
const AUTH_URL = "https://spirited-spontaneity-production.up.railway.app/api/auth";
const ALQUILER_URL = "https://spirited-spontaneity-production.up.railway.app/api/alquileres";
let componenteEnEdicionId = null;
let componentesCache = [];

window.onload = function() {
    if (document.getElementById("lista")) {
        configurarVistaPorRol();
        cargar();
    }
    if (document.getElementById("resumenComponente")) {
        prepararFormularioAlquiler();
    }
    if (document.getElementById("resumenPago")) {
        prepararFormularioPago();
    }
};

function obtenerUsuarioActivo() {
    const usuario = localStorage.getItem("usuarioActivo");
    return usuario ? JSON.parse(usuario) : null;
}

function obtenerPasoAlquiler() {
    const paso = localStorage.getItem("alquilerEnProceso");
    return paso ? JSON.parse(paso) : null;
}

function guardarPasoAlquiler(datos) {
    localStorage.setItem("alquilerEnProceso", JSON.stringify(datos));
}

function limpiarProcesoAlquiler() {
    localStorage.removeItem("componenteSeleccionado");
    localStorage.removeItem("alquilerEnProceso");
}

function mostrarMensaje(id, texto) {
    const nodo = document.getElementById(id);
    if (nodo) {
        nodo.textContent = texto;
    }
}

function configurarVistaPorRol() {
    const usuario = obtenerUsuarioActivo();
    const container = document.querySelector(".container");
    const lista = document.getElementById("lista");
    const bloqueAdmin = document.getElementById("bloqueAdmin");
    const bloqueAlquileres = document.getElementById("bloqueAlquileres");
    const mensajeRol = document.getElementById("mensajeRol");
    const usuarioInfo = document.getElementById("usuarioInfo");
    const rolActivo = document.getElementById("rolActivo");
    const loginLink = document.getElementById("loginLink");
    const logoutButton = document.getElementById("logoutButton");

    if (usuarioInfo) {
        usuarioInfo.textContent = usuario
            ? `${usuario.nombre} - ${usuario.rol}`
            : "Invitado - sin sesión iniciada";
    }

    if (rolActivo) {
        rolActivo.textContent = usuario ? usuario.rol : "Sin sesión";
    }

    if (loginLink) {
        loginLink.textContent = usuario ? "Cambiar sesión" : "Ir al login";
    }

    if (logoutButton) {
        logoutButton.style.display = usuario ? "inline-flex" : "none";
    }

    if (!usuario) {
        if (container) {
            container.classList.add("single-column");
        }
        if (lista) {
            lista.classList.add("catalog-grid");
        }
        if (bloqueAdmin) {
            bloqueAdmin.style.display = "none";
        }
        if (bloqueAlquileres) {
            bloqueAlquileres.style.display = "none";
        }
        if (mensajeRol) {
            mensajeRol.textContent = "Explora el catálogo públicamente o inicia sesión para alquilar y gestionar componentes.";
        }
        return;
    }

    if (usuario.rol === "ADMIN") {
        if (container) {
            container.classList.remove("single-column");
        }
        if (lista) {
            lista.classList.remove("catalog-grid");
        }
        if (bloqueAdmin) {
            bloqueAdmin.style.display = "block";
        }
        if (bloqueAlquileres) {
            bloqueAlquileres.style.display = "none";
        }
        if (mensajeRol) {
            mensajeRol.textContent = "Modo administrador: puedes añadir componentes y consultar el catálogo.";
        }
    } else {
        if (container) {
            container.classList.add("single-column");
        }
        if (lista) {
            lista.classList.add("catalog-grid");
        }
        if (bloqueAdmin) {
            bloqueAdmin.style.display = "none";
        }
        if (bloqueAlquileres) {
            bloqueAlquileres.style.display = "block";
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
            componentesCache = data;
            actualizarResumen(data);
            cargarAlquileresUsuario();
            aplicarFiltros();
        })
        .catch(error => console.error("Error al cargar:", error));
}

function aplicarFiltros() {
    const lista = document.getElementById("lista");
    const mensajeFiltros = document.getElementById("mensajeFiltros");
    const usuario = obtenerUsuarioActivo();
    const textoBusqueda = document.getElementById("busquedaComponente")?.value?.trim().toLowerCase() || "";
    const tipoSeleccionado = document.getElementById("filtroTipo")?.value || "";
    const estadoSeleccionado = document.getElementById("filtroEstado")?.value || "";

    if (!lista) {
        return;
    }

    lista.innerHTML = "";

    if (componentesCache.length === 0) {
        const li = document.createElement("li");
        li.className = "item-card";
        li.innerHTML = `
            <div class="item-info">
                <strong>No hay componentes registrados</strong>
                <span>Añade un componente nuevo para empezar a trabajar con el catálogo.</span>
            </div>
        `;
        lista.appendChild(li);
        if (mensajeFiltros) {
            mensajeFiltros.textContent = "";
        }
        return;
    }

    const componentesFiltrados = componentesCache.filter(c => {
        const coincideNombre = c.nombre.toLowerCase().includes(textoBusqueda);
        const coincideTipo = !tipoSeleccionado || c.tipo === tipoSeleccionado;
        const coincideEstado = !estadoSeleccionado || c.estado === estadoSeleccionado;
        return coincideNombre && coincideTipo && coincideEstado;
    });

    if (mensajeFiltros) {
        mensajeFiltros.textContent = componentesFiltrados.length === componentesCache.length
            ? `Mostrando ${componentesFiltrados.length} componentes del catálogo.`
            : `Mostrando ${componentesFiltrados.length} de ${componentesCache.length} componentes.`;
    }

    if (componentesFiltrados.length === 0) {
        const li = document.createElement("li");
        li.className = "item-card";
        li.innerHTML = `
            <div class="item-info">
                <strong>No hay resultados</strong>
                <span>Prueba con otra búsqueda o cambia los filtros aplicados.</span>
            </div>
        `;
        lista.appendChild(li);
        return;
    }

    componentesFiltrados.forEach(c => {
        const li = document.createElement("li");
        li.className = "item-card";

        const imagen = document.createElement("img");
        imagen.className = "item-image";
        imagen.src = obtenerImagenPorTipo(c.tipo);
        imagen.alt = c.tipo;
        li.appendChild(imagen);

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
                iniciarProcesoAlquiler(c);
            };
            li.appendChild(boton);
        }

        if (usuario && usuario.rol === "ADMIN") {
            const botonEditar = document.createElement("button");
            botonEditar.type = "button";
            botonEditar.className = "secondary-button";
            botonEditar.textContent = "Editar";
            botonEditar.onclick = function() {
                prepararEdicion(c);
            };
            li.appendChild(botonEditar);

            const botonEliminar = document.createElement("button");
            botonEliminar.type = "button";
            botonEliminar.className = "delete-button";
            botonEliminar.textContent = "Eliminar";
            botonEliminar.onclick = function() {
                eliminarComponente(c.id, c.nombre);
            };
            li.appendChild(botonEliminar);
        }

        lista.appendChild(li);
    });
}

function limpiarFiltros() {
    const búsqueda = document.getElementById("busquedaComponente");
    const filtroTipo = document.getElementById("filtroTipo");
    const filtroEstado = document.getElementById("filtroEstado");

    if (búsqueda) {
        búsqueda.value = "";
    }
    if (filtroTipo) {
        filtroTipo.value = "";
    }
    if (filtroEstado) {
        filtroEstado.value = "";
    }

    aplicarFiltros();
}

function obtenerImagenPorTipo(tipo) {
    const tipoNormalizado = (tipo || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    if (tipoNormalizado.includes("ram")) return "img/ram.svg";
    if (tipoNormalizado.includes("ssd")) return "img/ssd.svg";
    if (tipoNormalizado.includes("hdd")) return "img/hdd.svg";
    if (tipoNormalizado.includes("graf")) return "img/grafica.svg";
    if (tipoNormalizado.includes("procesador")) return "img/procesador.svg";
    if (tipoNormalizado.includes("placa")) return "img/placa-base.svg";
    if (tipoNormalizado.includes("refriger")) return "img/refrigeracion.svg";
    if (tipoNormalizado.includes("caja")) return "img/caja.svg";
    if (tipoNormalizado.includes("monitor")) return "img/monitor.svg";
    if (tipoNormalizado.includes("perifer")) return "img/periferico.svg";
    if (tipoNormalizado.includes("fuente")) return "img/fuente.svg";

    return "img/monitor.svg";
}

function actualizarResumen(componentes) {
    const total = document.getElementById("totalComponentes");
    const disponibles = document.getElementById("totalDisponibles");
    const alquilados = document.getElementById("totalAlquilados");

    if (!total || !disponibles || !alquilados) {
        return;
    }

    total.textContent = componentes.length;
    disponibles.textContent = componentes.filter(c => c.estado === "Disponible").length;
    alquilados.textContent = componentes.filter(c => c.estado === "Alquilado").length;
}

function cargarAlquileresUsuario() {
    const usuario = obtenerUsuarioActivo();
    const lista = document.getElementById("listaAlquileres");
    const mensaje = document.getElementById("mensajeAlquileres");

    if (!lista || !mensaje) {
        return;
    }

    lista.innerHTML = "";

    if (!usuario || usuario.rol !== "USER") {
        mensaje.textContent = "";
        return;
    }

    fetch(`${ALQUILER_URL}/usuario/${usuario.id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudieron cargar los alquileres");
            }
            return response.json();
        })
        .then(alquileres => {
            mensaje.textContent = alquileres.length > 0
                ? "Consulta el estado de tus alquileres y realiza devoluciones cuando sea necesario."
                : "Todavía no tienes alquileres registrados.";

            if (alquileres.length === 0) {
                const li = document.createElement("li");
                li.className = "item-card";
                li.innerHTML = `
                    <div class="item-info">
                        <strong>Sin alquileres activos</strong>
                        <span>Cuando alquiles un componente, aparecera reflejado en este apartado.</span>
                    </div>
                `;
                lista.appendChild(li);
                return;
            }

            alquileres.forEach(alquiler => {
                const li = document.createElement("li");
                li.className = "item-card";

                const info = document.createElement("div");
                info.className = "item-info";
                info.innerHTML = `
                    <strong>${alquiler.componente.nombre}</strong>
                    <span>Desde ${alquiler.fechaInicio} hasta ${alquiler.fechaFin}</span>
                    <span>Pago: ${alquiler.métodoPago}</span>
                    <span class="badge ${alquiler.estado.toLowerCase()}">${alquiler.estado}</span>
                `;
                li.appendChild(info);

                if (alquiler.estado === "Activo") {
                    const boton = document.createElement("button");
                    boton.type = "button";
                    boton.className = "return-button";
                    boton.textContent = "Devolver";
                    boton.onclick = function() {
                        devolverAlquiler(alquiler.id);
                    };
                    li.appendChild(boton);
                }

                lista.appendChild(li);
            });
        })
        .catch(error => {
            mensaje.textContent = error.message;
        });
}

function guardar() {
    const usuario = obtenerUsuarioActivo();
    const nombre = document.getElementById("nombre").value.trim();
    const tipo = document.getElementById("tipo").value;
    const estado = document.getElementById("estado").value;
    const mensaje = document.getElementById("mensajeFormularioAdmin");
    const método = componenteEnEdicionId ? "PUT" : "POST";
    const urlDestino = componenteEnEdicionId ? `${URL}/${componenteEnEdicionId}` : URL;

    if (!usuario || usuario.rol !== "ADMIN") {
        mostrarMensaje("mensajeFormularioAdmin", "Solo un administrador puede añadir componentes.");
        return;
    }

    if (!nombre || !tipo || !estado) {
        mostrarMensaje("mensajeFormularioAdmin", "Rellena todos los campos del formulario.");
        return;
    }

    fetch(urlDestino, {
        method: método,
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
            return response.text().then(text => {
                throw new Error(text || "Error al guardar");
            });
        }
        return response.json();
    })
    .then(() => {
        if (mensaje) {
            mensaje.textContent = componenteEnEdicionId
                ? "Componente actualizado correctamente."
                : "Componente guardado correctamente.";
        }
        limpiarFormulario();
        cargar();
    })
    .catch(error => {
        if (mensaje) {
            mensaje.textContent = error.message;
        }
    });
}

function limpiarFormulario() {
    document.getElementById("nombre").value = "";
    document.getElementById("tipo").value = "";
    document.getElementById("estado").value = "";
    componenteEnEdicionId = null;

    const titulo = document.getElementById("tituloFormularioAdmin");
    const botonGuardar = document.getElementById("botonGuardarComponente");
    const botonCancelar = document.getElementById("botonCancelarEdicion");

    if (titulo) {
        titulo.textContent = "Añadir componente";
    }
    if (botonGuardar) {
        botonGuardar.textContent = "Guardar componente";
    }
    if (botonCancelar) {
        botonCancelar.style.display = "none";
    }
}

function prepararEdicion(componente) {
    const formulario = document.getElementById("bloqueAdmin");
    componenteEnEdicionId = componente.id;
    document.getElementById("nombre").value = componente.nombre;
    document.getElementById("tipo").value = componente.tipo;
    document.getElementById("estado").value = componente.estado;

    const titulo = document.getElementById("tituloFormularioAdmin");
    const mensaje = document.getElementById("mensajeFormularioAdmin");
    const botonGuardar = document.getElementById("botonGuardarComponente");
    const botonCancelar = document.getElementById("botonCancelarEdicion");

    if (titulo) {
        titulo.textContent = "Editar componente";
    }
    if (mensaje) {
        mensaje.textContent = `Editando: ${componente.nombre}`;
    }
    if (botonGuardar) {
        botonGuardar.textContent = "Actualizar componente";
    }
    if (botonCancelar) {
        botonCancelar.style.display = "inline-flex";
    }
    if (formulario) {
        formulario.scrollIntoView({ behavior: "smooth", block: "start" });
        formulario.classList.add("form-highlight");
        setTimeout(() => {
            formulario.classList.remove("form-highlight");
        }, 1800);
    }
    document.getElementById("nombre").focus();
}

function cancelarEdicion() {
    const mensaje = document.getElementById("mensajeFormularioAdmin");
    if (mensaje) {
        mensaje.textContent = "";
    }
    limpiarFormulario();
}

function iniciarProcesoAlquiler(componente) {
    const usuario = obtenerUsuarioActivo();

    if (!usuario || usuario.rol !== "USER") {
        mostrarMensaje("mensajeCatalogoAccion", "Debes iniciar sesión como usuario para alquilar.");
        return;
    }

    localStorage.setItem("componenteSeleccionado", JSON.stringify(componente));
    localStorage.removeItem("alquilerEnProceso");
    window.location.href = "alquiler.html";
}

function prepararFormularioAlquiler() {
    const usuario = obtenerUsuarioActivo();
    const componente = localStorage.getItem("componenteSeleccionado");
    const resumen = document.getElementById("resumenComponente");
    const fechaInicio = document.getElementById("fechaInicio");
    const fechaFin = document.getElementById("fechaFin");
    const mensaje = document.getElementById("mensajeAlquilerFormulario");
    const datosGuardados = obtenerPasoAlquiler();

    if (!usuario || usuario.rol !== "USER") {
        if (mensaje) {
            mensaje.textContent = "Debes iniciar sesión como usuario para completar el alquiler.";
        }
        return;
    }

    if (!componente) {
        if (resumen) {
            resumen.innerHTML = `
                <p class="panel-label">Componente seleccionado</p>
                <p class="demo-user">No hay ningún componente pendiente de alquiler.</p>
            `;
        }
        return;
    }

    const componenteParseado = JSON.parse(componente);

    if (resumen) {
        resumen.innerHTML = `
            <p class="panel-label">Componente seleccionado</p>
            <p class="demo-user"><strong>Nombre:</strong> ${componenteParseado.nombre}</p>
            <p class="demo-user"><strong>Tipo:</strong> ${componenteParseado.tipo}</p>
            <p class="demo-user"><strong>Estado actual:</strong> ${componenteParseado.estado}</p>
        `;
    }

    const hoy = new Date().toISOString().split("T")[0];
    const futura = new Date();
    futura.setDate(futura.getDate() + 7);

    if (fechaInicio) {
        fechaInicio.value = datosGuardados?.fechaInicio || hoy;
    }
    if (fechaFin) {
        fechaFin.value = datosGuardados?.fechaFin || futura.toISOString().split("T")[0];
    }

    const nombreCompleto = document.getElementById("nombreCompleto");
    const telefono = document.getElementById("telefono");
    const dirección = document.getElementById("dirección");

    if (nombreCompleto) {
        nombreCompleto.value = datosGuardados?.nombreCompleto || usuario.nombre || "";
    }
    if (telefono) {
        telefono.value = datosGuardados?.telefono || "";
    }
    if (dirección) {
        dirección.value = datosGuardados?.dirección || "";
    }
}

function continuarAlPago() {
    const usuario = obtenerUsuarioActivo();
    const componente = localStorage.getItem("componenteSeleccionado");
    const fechaInicio = document.getElementById("fechaInicio")?.value;
    const fechaFin = document.getElementById("fechaFin")?.value;
    const nombreCompleto = document.getElementById("nombreCompleto")?.value?.trim();
    const telefono = document.getElementById("telefono")?.value?.trim();
    const dirección = document.getElementById("dirección")?.value?.trim();
    const mensaje = document.getElementById("mensajeAlquilerFormulario");

    if (!usuario || usuario.rol !== "USER") {
        if (mensaje) mensaje.textContent = "Debes iniciar sesión como usuario para continuar.";
        return;
    }

    if (!componente) {
        if (mensaje) mensaje.textContent = "No hay ningún componente seleccionado.";
        return;
    }

    if (!fechaInicio || !fechaFin || !nombreCompleto || !telefono || !dirección) {
        if (mensaje) mensaje.textContent = "Debes completar todos los datos del alquiler.";
        return;
    }

    if (fechaFin < fechaInicio) {
        if (mensaje) mensaje.textContent = "La fecha fin no puede ser anterior a la fecha inicio.";
        return;
    }

    guardarPasoAlquiler({
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        nombreCompleto: nombreCompleto,
        telefono: telefono,
        dirección: dirección
    });

    window.location.href = "pago.html";
}

function prepararFormularioPago() {
    const usuario = obtenerUsuarioActivo();
    const componente = localStorage.getItem("componenteSeleccionado");
    const datos = obtenerPasoAlquiler();
    const resumen = document.getElementById("resumenPago");
    const mensaje = document.getElementById("mensajePagoFormulario");

    if (!usuario || usuario.rol !== "USER") {
        if (mensaje) mensaje.textContent = "Debes iniciar sesión como usuario para completar el pago.";
        return;
    }

    if (!componente || !datos) {
        if (resumen) {
            resumen.innerHTML = `
                <p class="panel-label">Resumen del alquiler</p>
                <p class="demo-user">Faltan datos del alquiler. Vuelve al paso anterior.</p>
            `;
        }
        return;
    }

    const componenteParseado = JSON.parse(componente);
    resumen.innerHTML = `
        <p class="panel-label">Resumen del alquiler</p>
        <p class="demo-user"><strong>Componente:</strong> ${componenteParseado.nombre}</p>
        <p class="demo-user"><strong>Fechas:</strong> ${datos.fechaInicio} a ${datos.fechaFin}</p>
        <p class="demo-user"><strong>Cliente:</strong> ${datos.nombreCompleto}</p>
    `;

    actualizarCamposPago();
}

function actualizarCamposPago() {
    const método = document.getElementById("métodoPago")?.value;
    const detalle = document.getElementById("detallePago");
    const ayuda = document.getElementById("ayudaPago");

    if (!detalle || !ayuda) {
        return;
    }

    if (método === "Bizum") {
        detalle.innerHTML = `
            <label class="field-label" for="telefonoBizum">Número de telefono</label>
            <input type="text" id="telefonoBizum" placeholder="Ejemplo: 612345678">
        `;
        ayuda.textContent = "Introduce un número de telefono asociado a Bizum.";
        return;
    }

    if (método === "Tarjeta") {
        detalle.innerHTML = `
            <label class="field-label" for="titularTarjeta">Titular</label>
            <input type="text" id="titularTarjeta" placeholder="Nombre del titular">
            <label class="field-label" for="númeroTarjeta">Número de tarjeta</label>
            <input type="text" id="númeroTarjeta" placeholder="1111 2222 3333 4444">
            <label class="field-label" for="caducidadTarjeta">Caducidad</label>
            <input type="text" id="caducidadTarjeta" placeholder="MM/AA">
            <label class="field-label" for="cvvTarjeta">CVV</label>
            <input type="text" id="cvvTarjeta" placeholder="123">
        `;
        ayuda.textContent = "Rellena los datos de la tarjeta para continuar.";
        return;
    }

    if (método === "Transferencia") {
        detalle.innerHTML = `
            <label class="field-label" for="ibanTransferencia">IBAN</label>
            <input type="text" id="ibanTransferencia" placeholder="ES00 0000 0000 0000 0000 0000">
        `;
        ayuda.textContent = "Introduce un IBAN para simular la transferencia.";
        return;
    }

    detalle.innerHTML = "";
    ayuda.textContent = "Seleccióna un método de pago para continuar.";
}

function confirmarAlquiler() {
    const usuario = obtenerUsuarioActivo();
    const componente = localStorage.getItem("componenteSeleccionado");
    const datos = obtenerPasoAlquiler();
    const métodoPago = document.getElementById("métodoPago")?.value;
    const mensaje = document.getElementById("mensajePagoFormulario");

    if (!usuario || usuario.rol !== "USER") {
        if (mensaje) mensaje.textContent = "Solo un usuario puede alquilar componentes.";
        return;
    }

    if (!componente || !datos) {
        if (mensaje) mensaje.textContent = "Faltan datos del alquiler. Vuelve al paso anterior.";
        return;
    }

    if (!métodoPago) {
        if (mensaje) mensaje.textContent = "Debes elegir un método de pago.";
        return;
    }

    const detallePago = obtenerDetallePago(métodoPago);
    if (!detallePago.valido) {
        if (mensaje) mensaje.textContent = detallePago.mensaje;
        return;
    }

    const componenteParseado = JSON.parse(componente);

    fetch(`${ALQUILER_URL}/crear`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            usuarioId: usuario.id,
            componenteId: componenteParseado.id,
            fechaInicio: datos.fechaInicio,
            fechaFin: datos.fechaFin,
            métodoPago: métodoPago
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
        limpiarProcesoAlquiler();
        window.location.href = "index.html";
    })
    .catch(error => {
        if (mensaje) {
            mensaje.textContent = error.message.includes("Failed to fetch")
                ? "No se pudo conectar con el endpoint de alquileres. Reinicia el backend y vuelve a intentarlo."
                : error.message;
        }
    });
}

function obtenerDetallePago(métodoPago) {
    if (métodoPago === "Bizum") {
        const telefonoBizum = document.getElementById("telefonoBizum")?.value?.trim();
        if (!telefonoBizum) {
            return { valido: false, mensaje: "Debes indicar un número para Bizum." };
        }
        return { valido: true };
    }

    if (métodoPago === "Tarjeta") {
        const titular = document.getElementById("titularTarjeta")?.value?.trim();
        const número = document.getElementById("númeroTarjeta")?.value?.trim();
        const caducidad = document.getElementById("caducidadTarjeta")?.value?.trim();
        const cvv = document.getElementById("cvvTarjeta")?.value?.trim();

        if (!titular || !número || !caducidad || !cvv) {
            return { valido: false, mensaje: "Debes rellenar todos los datos de la tarjeta." };
        }
        return { valido: true };
    }

    if (métodoPago === "Transferencia") {
        const iban = document.getElementById("ibanTransferencia")?.value?.trim();
        if (!iban) {
            return { valido: false, mensaje: "Debes indicar un IBAN para la transferencia." };
        }
        return { valido: true };
    }

    return { valido: false, mensaje: "Seleccióna un método de pago valido." };
}

function devolverAlquiler(alquilerId) {
    const usuario = obtenerUsuarioActivo();

    if (!usuario || usuario.rol !== "USER") {
        mostrarMensaje("mensajeAlquilerAccion", "Solo un usuario puede devolver alquileres.");
        return;
    }

    fetch(`${ALQUILER_URL}/${alquilerId}/devolver`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            usuarioId: usuario.id
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(text || "No se pudo realizar la devolucion");
            });
        }
        return response.json();
    })
    .then(data => {
        mostrarMensaje("mensajeAlquilerAccion", data.mensaje);
        cargar();
    })
    .catch(error => {
        mostrarMensaje("mensajeAlquilerAccion", error.message.includes("Failed to fetch")
            ? "No se pudo conectar con el endpoint de devolucion. Reinicia el backend y vuelve a intentarlo."
            : error.message);
    });
}

function eliminarComponente(componenteId, nombreComponente) {
    const usuario = obtenerUsuarioActivo();

    if (!usuario || usuario.rol !== "ADMIN") {
        mostrarMensaje("mensajeCatalogoAccion", "Solo un administrador puede eliminar componentes.");
        return;
    }

    const confirmado = confirm(`Vas a eliminar el componente ${nombreComponente}. Quieres continuar?`);
    if (!confirmado) {
        return;
    }

    fetch(`${URL}/${componenteId}`, {
        method: "DELETE",
        headers: {
            "X-User-Role": usuario.rol
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(text || "No se pudo eliminar el componente");
            });
        }
        return response.text();
    })
    .then(mensaje => {
        mostrarMensaje("mensajeCatalogoAccion", mensaje);
        cargar();
    })
    .catch(error => {
        mostrarMensaje("mensajeCatalogoAccion", error.message.includes("Failed to fetch")
            ? "No se pudo conectar con el backend para eliminar el componente."
            : error.message);
    });
}

function cerrarSesion() {
    localStorage.removeItem("usuarioActivo");
    limpiarProcesoAlquiler();
    window.location.href = "index.html";
}

function register() {
    const nombre = document.getElementById("registerNombre")?.value?.trim();
    const email = document.getElementById("registerEmail")?.value?.trim();
    const password = document.getElementById("registerPassword")?.value?.trim();
    const rol = document.getElementById("registerRol")?.value || "USER";
    const mensaje = document.getElementById("mensajeRegistro");

    if (!nombre || !email || !password) {
        if (mensaje) mensaje.textContent = "Completa nombre, email y contraseña para crear el usuario";
        return;
    }

    fetch(`${AUTH_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nombre: nombre,
            email: email,
            password: password,
            rol: "USER"
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(text || `Error ${response.status}`);
            });
        }
        return response.json();
    })
    .then(data => {
        if (mensaje) mensaje.textContent = `Usuario ${data.nombre} creado correctamente. Ya puedes iniciar sesión.`;

        const nombreInput = document.getElementById("registerNombre");
        const emailInput = document.getElementById("registerEmail");
        const passwordInput = document.getElementById("registerPassword");
        const loginEmail = document.getElementById("email");

        if (nombreInput) nombreInput.value = "";
        if (emailInput) emailInput.value = "";
        if (passwordInput) passwordInput.value = "";
        if (loginEmail) loginEmail.value = data.email;
    })
    .catch(error => {
        if (mensaje) {
            mensaje.textContent = error.message.includes("Failed to fetch")
                ? "No se pudo conectar con el backend publicado para crear el usuario."
                : error.message;
        }
    });
}
function login() {
    const email = document.getElementById("email")?.value?.trim();
    const password = document.getElementById("password")?.value?.trim();
    const mensaje = document.getElementById("mensajeLogin");

    if (!email || !password) {
        if (mensaje) mensaje.textContent = "Rellena email y contraseña";
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
                throw new Error(text || `Error ${response.status}`);
            });
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem("usuarioActivo", JSON.stringify(data.usuario));
        if (mensaje) mensaje.textContent = `Bienvenido ${data.usuario.nombre}`;
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    })
    .catch(error => {
        if (mensaje) {
            mensaje.textContent = error.message.includes("Failed to fetch")
                ? "No se pudo conectar con el backend publicado. Revisa que el servicio backend este online y permita peticiones desde el frontend."
                : error.message;
        }
    });
}













