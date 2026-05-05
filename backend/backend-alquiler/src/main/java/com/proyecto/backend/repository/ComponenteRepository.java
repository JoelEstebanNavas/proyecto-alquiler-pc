package com.proyecto.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.proyecto.backend.model.Componente;

public interface ComponenteRepository extends JpaRepository<Componente, Long> {
}
