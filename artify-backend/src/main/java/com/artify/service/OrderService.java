package com.artify.service;

import com.artify.dto.request.OrderRequest;
import com.artify.dto.response.OrderItemResponse;
import com.artify.dto.response.OrderResponse;
import com.artify.dto.response.ProductResponse;
import com.artify.exception.BadRequestException;
import com.artify.exception.ResourceNotFoundException;
import com.artify.exception.UnauthorizedException;
import com.artify.model.*;
import com.artify.model.enums.OrderStatus;
import com.artify.repository.CartRepository;
import com.artify.repository.OrderRepository;
import com.artify.repository.ProductRepository;
import com.artify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public OrderResponse placeOrder(Long userId, OrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart", "userId", userId));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty. Cannot place order.");
        }

        Order order = Order.builder()
                .user(user)
                .shippingAddress(request.getShippingAddress())
                .status(OrderStatus.PENDING)
                .items(new ArrayList<>())
                .totalAmount(0.0)
                .build();

        double totalAmount = 0.0;

        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();

            if (product.getStock() < cartItem.getQuantity()) {
                throw new BadRequestException("Insufficient stock for product: " + product.getTitle());
            }

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .priceAtPurchase(product.getPrice())
                    .build();

            order.getItems().add(orderItem);
            totalAmount += cartItem.getQuantity() * product.getPrice();

            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
        }

        order.setTotalAmount(totalAmount);
        order = orderRepository.save(order);

        cart.getItems().clear();
        cartRepository.save(cart);

        log.info("Order placed with id: {} for user: {}", order.getId(), userId);
        return mapToOrderResponse(order);
    }

    public List<OrderResponse> getOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToOrderResponse)
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        if (!order.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to view this order");
        }

        return mapToOrderResponse(order);
    }

    @Transactional
    public OrderResponse cancelOrder(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        if (!order.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to cancel this order");
        }

        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new BadRequestException("Order cannot be cancelled. Current status: " + order.getStatus());
        }

        order.setStatus(OrderStatus.CANCELLED);

        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStock(product.getStock() + item.getQuantity());
            productRepository.save(product);
        }

        order = orderRepository.save(order);
        log.info("Order cancelled with id: {}", orderId);
        return mapToOrderResponse(order);
    }

    public OrderResponse trackOrder(Long orderId, Long userId) {
        return getOrderById(orderId, userId);
    }

    private OrderResponse mapToOrderResponse(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(this::mapToOrderItemResponse)
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus().name())
                .shippingAddress(order.getShippingAddress())
                .createdAt(order.getCreatedAt())
                .items(itemResponses)
                .build();
    }

    private OrderItemResponse mapToOrderItemResponse(OrderItem item) {
        return OrderItemResponse.builder()
                .id(item.getId())
                .orderId(item.getOrder().getId())
                .productId(item.getProduct().getId())
                .quantity(item.getQuantity())
                .priceAtPurchase(item.getPriceAtPurchase())
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
