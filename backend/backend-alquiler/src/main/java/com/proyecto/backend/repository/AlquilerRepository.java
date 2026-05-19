package com.proyecto.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.proyecto.backend.model.Alquiler;

public interface AlquilerRepository extends JpaRepository<Alquiler, Long> {

    List<Alquiler> findByUsuarioId(Long usuarioId);

    boolean existsByComponenteId(Long componenteId);
}
