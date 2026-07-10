package com.artify.repository;

import com.artify.model.Product;
import com.artify.model.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    List<Product> findByArtistId(Long artistId);
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByStatus(ProductStatus status);

    @Query("SELECT p FROM Product p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Product> searchByTitleOrDescription(@Param("query") String query, Pageable pageable);

    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);
    Page<Product> findByArtistId(Long artistId, Pageable pageable);
    Page<Product> findByPriceBetween(Double minPrice, Double maxPrice, Pageable pageable);
}
