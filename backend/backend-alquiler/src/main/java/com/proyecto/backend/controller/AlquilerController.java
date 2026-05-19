package com.proyecto.backend.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyecto.backend.model.Alquiler;
import com.proyecto.backend.model.Componente;
import com.proyecto.backend.model.Usuario;
import com.proyecto.backend.repository.AlquilerRepository;
import com.proyecto.backend.repository.ComponenteRepository;
import com.proyecto.backend.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/alquileres")
@CrossOrigin
public class AlquilerController {

    @Autowired
    private AlquilerRepository alquilerRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ComponenteRepository componenteRepository;

    @GetMapping
    public List<Alquiler> getAll() {
        return alquilerRepository.findAll();
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<?> getByUsuario(@PathVariable Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId).orElse(null);

        if (usuario == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }

        return ResponseEntity.ok(alquilerRepository.findByUsuarioId(usuarioId));
    }

    @PostMapping
    public Alquiler guardar(@RequestBody Alquiler alquiler) {
        return alquilerRepository.save(alquiler);
    }

    @PostMapping("/crear")
    public ResponseEntity<?> crearAlquiler(@RequestBody Map<String, Object> datos) {
        Long usuarioId = extraerLong(datos.get("usuarioId"));
        Long componenteId = extraerLong(datos.get("componenteId"));
        String fechaInicioTexto = (String) datos.get("fechaInicio");
        String fechaFinTexto = (String) datos.get("fechaFin");
        String metodoPago = (String) datos.get("metodoPago");

        if (usuarioId == null || componenteId == null) {
            return ResponseEntity.badRequest().body("Faltan datos para crear el alquiler");
        }

        if (fechaInicioTexto == null || fechaFinTexto == null || metodoPago == null || metodoPago.isBlank()) {
            return ResponseEntity.badRequest().body("Debes indicar fechas y metodo de pago");
        }

        Usuario usuario = usuarioRepository.findById(usuarioId).orElse(null);
        Componente componente = componenteRepository.findById(componenteId).orElse(null);

        if (usuario == null || componente == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario o componente no encontrado");
        }

        if (!"USER".equalsIgnoreCase(usuario.getRol())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Solo los usuarios pueden alquilar componentes");
        }

        if (!"Disponible".equalsIgnoreCase(componente.getEstado())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("El componente ya no esta disponible");
        }

        LocalDate fechaInicio;
        LocalDate fechaFin;

        try {
            fechaInicio = LocalDate.parse(fechaInicioTexto);
            fechaFin = LocalDate.parse(fechaFinTexto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Las fechas indicadas no son validas");
        }

        if (fechaFin.isBefore(fechaInicio)) {
            return ResponseEntity.badRequest().body("La fecha fin no puede ser anterior a la fecha inicio");
        }

        Alquiler alquiler = new Alquiler();
        alquiler.setUsuario(usuario);
        alquiler.setComponente(componente);
        alquiler.setFechaInicio(fechaInicio);
        alquiler.setFechaFin(fechaFin);
        alquiler.setEstado("Activo");
        alquiler.setMetodoPago(metodoPago);

        componente.setEstado("Alquilado");
        componenteRepository.save(componente);
        Alquiler guardado = alquilerRepository.save(alquiler);

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Alquiler realizado correctamente");
        respuesta.put("alquiler", guardado);
        return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
    }

    @PostMapping("/{alquilerId}/devolver")
    public ResponseEntity<?> devolverAlquiler(@PathVariable Long alquilerId,
            @RequestBody Map<String, Long> datos) {
        Long usuarioId = datos.get("usuarioId");

        if (usuarioId == null) {
            return ResponseEntity.badRequest().body("Falta el usuario que realiza la devolucion");
        }

        Alquiler alquiler = alquilerRepository.findById(alquilerId).orElse(null);

        if (alquiler == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Alquiler no encontrado");
        }

        if (!alquiler.getUsuario().getId().equals(usuarioId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("No puedes devolver un alquiler de otro usuario");
        }

        if (!"Activo".equalsIgnoreCase(alquiler.getEstado())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("El alquiler ya esta cerrado");
        }

        alquiler.setEstado("Finalizado");

        Componente componente = alquiler.getComponente();
        componente.setEstado("Disponible");

        componenteRepository.save(componente);
        Alquiler actualizado = alquilerRepository.save(alquiler);

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Devolucion realizada correctamente");
        respuesta.put("alquiler", actualizado);
        return ResponseEntity.ok(respuesta);
    }

    private Long extraerLong(Object valor) {
        if (valor instanceof Integer) {
            return ((Integer) valor).longValue();
        }
        if (valor instanceof Long) {
            return (Long) valor;
        }
        if (valor instanceof String) {
            try {
                return Long.parseLong((String) valor);
            } catch (NumberFormatException e) {
                return null;
            }
        }
        return null;
    }
}
