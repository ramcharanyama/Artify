package com.artify.service;

import com.artify.dto.response.PagedResponse;
import com.artify.dto.response.ProductResponse;
import com.artify.dto.response.UserResponse;
import com.artify.exception.BadRequestException;
import com.artify.exception.ResourceNotFoundException;
import com.artify.model.Artist;
import com.artify.model.Product;
import com.artify.model.User;
import com.artify.model.enums.Role;
import com.artify.repository.ArtistRepository;
import com.artify.repository.OrderRepository;
import com.artify.repository.ProductRepository;
import com.artify.repository.UserRepository;
import com.artify.util.AppConstants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final ArtistRepository artistRepository;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse updateUserRole(Long userId, String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Role newRole;
        try {
            newRole = Role.valueOf(role.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role: " + role);
        }

        user.setRole(newRole);

        if (newRole == Role.ARTIST && artistRepository.findByUserId(userId).isEmpty()) {
            Artist artist = Artist.builder()
                    .user(user)
                    .isVerified(false)
                    .rating(0.0)
                    .build();
            artistRepository.save(artist);
        }

        user = userRepository.save(user);
        log.info("User role updated for user: {} to role: {}", userId, newRole);
        return mapToUserResponse(user);
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        userRepository.delete(user);
        log.info("User deleted with id: {}", userId);
    }

    public PagedResponse<ProductResponse> getAllProducts(int page, int size) {
        if (size > AppConstants.MAX_PAGE_SIZE) {
            size = AppConstants.MAX_PAGE_SIZE;
        }
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Product> productPage = productRepository.findAll(pageable);

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

    @Transactional
    public void deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));
        productRepository.delete(product);
        log.info("Product deleted by admin with id: {}", productId);
    }

    public Map<String, Object> getReportSummary() {
        Map<String, Object> report = new HashMap<>();
        report.put("totalUsers", userRepository.count());
        report.put("totalProducts", productRepository.count());
        report.put("totalOrders", orderRepository.count());

        Double totalRevenue = orderRepository.findAll().stream()
                .mapToDouble(order -> order.getTotalAmount() != null ? order.getTotalAmount() : 0.0)
                .sum();
        report.put("totalRevenue", totalRevenue);

        return report;
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .phone(user.getPhone())
                .address(user.getAddress())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private ProductResponse mapToProductResponse(Product product) {
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
