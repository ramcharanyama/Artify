package com.artify.repository;

import com.artify.model.Artist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ArtistRepository extends JpaRepository<Artist, Long> {
    Optional<Artist> findByUserId(Long userId);
}
