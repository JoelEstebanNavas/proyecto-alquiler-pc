package com.proyecto.backend.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.proyecto.backend.model.Componente;
import com.proyecto.backend.repository.AlquilerRepository;
import com.proyecto.backend.repository.ComponenteRepository;

@RestController
@RequestMapping("/api/componentes")
@CrossOrigin
public class ComponenteController {

    @Autowired
    private ComponenteRepository repo;

    @Autowired
    private AlquilerRepository alquilerRepository;

    @GetMapping
    public List<Componente> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody Componente c,
            @RequestHeader(value = "X-User-Role", required = false) String rol) {
        if (rol == null || !"ADMIN".equalsIgnoreCase(rol)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Solo un administrador puede anadir componentes");
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(repo.save(c));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Componente datos,
            @RequestHeader(value = "X-User-Role", required = false) String rol) {
        if (rol == null || !"ADMIN".equalsIgnoreCase(rol)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Solo un administrador puede editar componentes");
        }

        Componente componente = repo.findById(id).orElse(null);

        if (componente == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Componente no encontrado");
        }

        componente.setNombre(datos.getNombre());
        componente.setTipo(datos.getTipo());
        componente.setEstado(datos.getEstado());

        return ResponseEntity.ok(repo.save(componente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id,
            @RequestHeader(value = "X-User-Role", required = false) String rol) {
        if (rol == null || !"ADMIN".equalsIgnoreCase(rol)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Solo un administrador puede eliminar componentes");
        }

        Componente componente = repo.findById(id).orElse(null);

        if (componente == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Componente no encontrado");
        }

        if (alquilerRepository.existsByComponenteId(id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("No se puede eliminar un componente con alquileres asociados");
        }

        repo.delete(componente);
        return ResponseEntity.ok("Componente eliminado correctamente");
    }
}
