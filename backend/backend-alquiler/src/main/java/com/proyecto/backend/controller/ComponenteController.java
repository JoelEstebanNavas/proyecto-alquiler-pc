package com.proyecto.backend.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.proyecto.backend.model.Componente;
import com.proyecto.backend.repository.ComponenteRepository;

@RestController
@RequestMapping("/api/componentes")
@CrossOrigin
public class ComponenteController {

    @Autowired
    private ComponenteRepository repo;

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
}
