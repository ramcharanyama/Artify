package com.artify.service;

import com.artify.dto.request.ProductRequest;
import com.artify.dto.response.PagedResponse;
import com.artify.dto.response.ProductResponse;
import com.artify.exception.BadRequestException;
import com.artify.exception.ResourceNotFoundException;
import com.artify.exception.UnauthorizedException;
import com.artify.model.Artist;
import com.artify.model.Category;
import com.artify.model.Product;
import com.artify.model.enums.ProductStatus;
import com.artify.repository.ArtistRepository;
import com.artify.repository.CategoryRepository;
import com.artify.repository.ProductRepository;
import com.artify.util.AppConstants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ArtistRepository artistRepository;
    private final CategoryRepository categoryRepository;

    public PagedResponse<ProductResponse> getAllProducts(int page, int size, Long categoryId,
                                                         String search, Double minPrice, Double maxPrice,
                                                         String sortBy, String sortDir) {
        if (size > AppConstants.MAX_PAGE_SIZE) {
            size = AppConstants.MAX_PAGE_SIZE;
        }

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Product> productPage;

        if (search != null && !search.trim().isEmpty()) {
            productPage = productRepository.searchByTitleOrDescription(search.trim(), pageable);
        } else if (categoryId != null) {
            productPage = productRepository.findByCategoryId(categoryId, pageable);
        } else if (minPrice != null && maxPrice != null) {
            productPage = productRepository.findByPriceBetween(minPrice, maxPrice, pageable);
        } else {
            productPage = productRepository.findAll(pageable);
        }

        List<ProductResponse> content = productPage.getContent().stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());

        return PagedResponse.<ProductResponse>builder()
                .content(content)
                .page(productPage.getNumber())
                .size(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .last(productPage.isLast())
                .build();
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return mapToProductResponse(product);
    }

    @Transactional
    public ProductResponse createProduct(Long artistId, ProductRequest request) {
        Artist artist = artistRepository.findById(artistId)
                .orElseThrow(() -> new ResourceNotFoundException("Artist", "id", artistId));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        ProductStatus status;
        try {
            status = ProductStatus.valueOf(request.getStatus().toUpperCase());
        } catch (IllegalArgumentException e) {
            status = ProductStatus.ACTIVE;
        }

        Product product = Product.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .stock(request.getStock())
                .status(status)
                .artist(artist)
                .category(category)
                .build();

        product = productRepository.save(product);
        log.info("Product created with id: {}", product.getId());
        return mapToProductResponse(product);
    }

    @Transactional
    public ProductResponse updateProduct(Long productId, Long artistId, ProductRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        if (!product.getArtist().getId().equals(artistId)) {
            throw new UnauthorizedException("You are not authorized to update this product");
        }

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
            product.setCategory(category);
        }

        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setImageUrl(request.getImageUrl());
        product.setStock(request.getStock());

        if (request.getStatus() != null) {
            try {
                product.setStatus(ProductStatus.valueOf(request.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid product status: " + request.getStatus());
            }
        }

        product = productRepository.save(product);
        log.info("Product updated with id: {}", product.getId());
        return mapToProductResponse(product);
    }

    @Transactional
    public void deleteProduct(Long productId, Long artistId, boolean isAdmin) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        if (!isAdmin && !product.getArtist().getId().equals(artistId)) {
            throw new UnauthorizedException("You are not authorized to delete this product");
        }

        productRepository.delete(product);
        log.info("Product deleted with id: {}", productId);
    }

    public PagedResponse<ProductResponse> searchProducts(String query, int page, int size) {
        if (size > AppConstants.MAX_PAGE_SIZE) {
            size = AppConstants.MAX_PAGE_SIZE;
        }
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Product> productPage = productRepository.searchByTitleOrDescription(query, pageable);

        List<ProductResponse> content = productPage.getContent().stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());

        return PagedResponse.<ProductResponse>builder()
                .content(content)
                .page(productPage.getNumber())
                .size(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .last(productPage.isLast())
                .build();
    }

    public List<ProductResponse> getProductsByArtist(Long artistId) {
        return productRepository.findByArtistId(artistId).stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse mapToProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .artistId(product.getArtist().getId())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .title(product.getTitle())
                .description(product.getDescription())
                .price(product.getPrice())
                .imageUrl(product.getImageUrl())
                .stock(product.getStock())
                .status(product.getStatus().name())
                .createdAt(product.getCreatedAt())
                .artistName(product.getArtist().getUser().getName())
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .build();
    }
}
