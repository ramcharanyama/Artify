package com.artify.service;

import com.artify.dto.request.CartItemRequest;
import com.artify.dto.response.CartItemResponse;
import com.artify.dto.response.CartResponse;
import com.artify.dto.response.ProductResponse;
import com.artify.exception.ResourceNotFoundException;
import com.artify.model.Cart;
import com.artify.model.CartItem;
import com.artify.model.Product;
import com.artify.model.User;
import com.artify.repository.CartItemRepository;
import com.artify.repository.CartRepository;
import com.artify.repository.ProductRepository;
import com.artify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public CartResponse getCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return mapToCartResponse(cart);
    }

    @Transactional
    public CartResponse addItem(Long userId, CartItemRequest request) {
        Cart cart = getOrCreateCart(userId);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));

        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId());

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            cart.getItems().add(newItem);
            cartItemRepository.save(newItem);
        }

        cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "userId", userId));
        return mapToCartResponse(cart);
    }

    @Transactional
    public CartResponse updateItem(Long userId, Long itemId, CartItemRequest request) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "userId", userId));

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new ResourceNotFoundException("CartItem", "id", itemId);
        }

        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);

        cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "userId", userId));
        return mapToCartResponse(cart);
    }

    @Transactional
    public CartResponse removeItem(Long userId, Long itemId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "userId", userId));

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", itemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new ResourceNotFoundException("CartItem", "id", itemId);
        }

        cart.getItems().remove(item);
        cartItemRepository.delete(item);

        cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "userId", userId));
        return mapToCartResponse(cart);
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "userId", userId));
        cart.getItems().clear();
        cartRepository.save(cart);
        log.info("Cart cleared for user: {}", userId);
    }

    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
            Cart newCart = Cart.builder()
                    .user(user)
                    .items(new ArrayList<>())
                    .build();
            return cartRepository.save(newCart);
        });
    }

    private CartResponse mapToCartResponse(Cart cart) {
        List<CartItemResponse> itemResponses = cart.getItems().stream()
                .map(this::mapToCartItemResponse)
                .collect(Collectors.toList());

        double totalAmount = cart.getItems().stream()
                .mapToDouble(item -> item.getQuantity() * item.getProduct().getPrice())
                .sum();

        return CartResponse.builder()
                .id(cart.getId())
                .userId(cart.getUser().getId())
                .items(itemResponses)
                .totalAmount(totalAmount)
                .build();
    }

    private CartItemResponse mapToCartItemResponse(CartItem item) {
        return CartItemResponse.builder()
                .id(item.getId())
                .cartId(item.getCart().getId())
                .productId(item.getProduct().getId())
                .quantity(item.getQuantity())
                .product(mapToProductResponse(item.getProduct()))
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
