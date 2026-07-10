package com.artify.controller;

import com.artify.dto.request.ProductRequest;
import com.artify.dto.response.ApiResponse;
import com.artify.dto.response.PagedResponse;
import com.artify.dto.response.ProductResponse;
import com.artify.exception.ResourceNotFoundException;
import com.artify.model.Artist;
import com.artify.model.User;
import com.artify.model.enums.Role;
import com.artify.repository.ArtistRepository;
import com.artify.repository.UserRepository;
import com.artify.service.ProductService;
import com.artify.util.AppConstants;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final UserRepository userRepository;
    private final ArtistRepository artistRepository;

    @GetMapping
    public ResponseEntity<PagedResponse<ProductResponse>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        PagedResponse<ProductResponse> response = productService.getAllProducts(
                page, size, category, search, minPrice, maxPrice, sortBy, sortDir);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable Long id) {
        ProductResponse response = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success("Product retrieved successfully", response));
    }

    @PostMapping
    @PreAuthorize("hasRole('ARTIST')")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ProductRequest request) {
        Long artistId = getArtistId(userDetails);
        ProductResponse response = productService.createProduct(artistId, request);
        return new ResponseEntity<>(ApiResponse.success("Product created successfully", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ARTIST')")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        Long artistId = getArtistId(userDetails);
        ProductResponse response = productService.updateProduct(id, artistId, request);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ARTIST', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userDetails.getUsername()));
        boolean isAdmin = user.getRole() == Role.ADMIN;
        Long artistId = null;
        if (!isAdmin) {
            Artist artist = artistRepository.findByUserId(user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Artist", "userId", user.getId()));
            artistId = artist.getId();
        }
        productService.deleteProduct(id, artistId, isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", null));
    }

    @GetMapping("/search")
    public ResponseEntity<PagedResponse<ProductResponse>> searchProducts(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<ProductResponse> response = productService.searchProducts(q, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/artist/{artistId}")
    public ResponseEntity<List<ProductResponse>> getProductsByArtist(@PathVariable Long artistId) {
        List<ProductResponse> response = productService.getProductsByArtist(artistId);
        return ResponseEntity.ok(response);
    }

    private Long getArtistId(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userDetails.getUsername()));
        Artist artist = artistRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Artist", "userId", user.getId()));
        return artist.getId();
    }
}
