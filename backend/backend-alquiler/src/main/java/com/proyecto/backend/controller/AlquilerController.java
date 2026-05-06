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

    @PostMapping
    public Alquiler guardar(@RequestBody Alquiler alquiler) {
        return alquilerRepository.save(alquiler);
    }

    @PostMapping("/crear")
    public ResponseEntity<?> crearAlquiler(@RequestBody Map<String, Long> datos) {
        Long usuarioId = datos.get("usuarioId");
        Long componenteId = datos.get("componenteId");

        if (usuarioId == null || componenteId == null) {
            return ResponseEntity.badRequest().body("Faltan datos para crear el alquiler");
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

        Alquiler alquiler = new Alquiler();
        alquiler.setUsuario(usuario);
        alquiler.setComponente(componente);
        alquiler.setFechaInicio(LocalDate.now());
        alquiler.setFechaFin(LocalDate.now().plusDays(7));
        alquiler.setEstado("Activo");

        componente.setEstado("Alquilado");
        componenteRepository.save(componente);
        Alquiler guardado = alquilerRepository.save(alquiler);

        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("mensaje", "Alquiler realizado correctamente");
        respuesta.put("alquiler", guardado);
        return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
    }
}
