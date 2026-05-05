package com.proyecto.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.proyecto.backend.model.Alquiler;

public interface AlquilerRepository extends JpaRepository<Alquiler, Long> {
}
