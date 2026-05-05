package com.proyecto.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proyecto.backend.model.Alquiler;
import com.proyecto.backend.repository.AlquilerRepository;

@RestController
@RequestMapping("/api/alquileres")
@CrossOrigin
public class AlquilerController {

    @Autowired
    private AlquilerRepository alquilerRepository;

    @GetMapping
    public List<Alquiler> getAll() {
        return alquilerRepository.findAll();
    }

    @PostMapping
    public Alquiler guardar(@RequestBody Alquiler alquiler) {
        return alquilerRepository.save(alquiler);
    }
}
