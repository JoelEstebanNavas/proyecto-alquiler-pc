package com.proyecto.backend.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

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
    public Componente guardar(@RequestBody Componente c) {
        return repo.save(c);
    }
}