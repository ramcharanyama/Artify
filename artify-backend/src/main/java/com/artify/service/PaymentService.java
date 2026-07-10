package com.artify.service;

import com.artify.dto.request.PaymentRequest;
import com.artify.dto.response.PaymentResponse;
import com.artify.exception.BadRequestException;
import com.artify.exception.ResourceNotFoundException;
import com.artify.exception.UnauthorizedException;
import com.artify.model.Order;
import com.artify.model.Payment;
import com.artify.model.enums.OrderStatus;
import com.artify.model.enums.PaymentMethod;
import com.artify.model.enums.PaymentStatus;
import com.artify.repository.OrderRepository;
import com.artify.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    @Transactional
    public PaymentResponse processPayment(Long userId, PaymentRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", request.getOrderId()));

        if (!order.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to pay for this order");
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new BadRequestException("Order is not in PENDING status. Current status: " + order.getStatus());
        }

        PaymentMethod paymentMethod;
        try {
            paymentMethod = PaymentMethod.valueOf(request.getMethod().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid payment method: " + request.getMethod());
        }

        Payment payment = Payment.builder()
                .order(order)
                .method(paymentMethod)
                .transactionId(UUID.randomUUID().toString())
                .amount(order.getTotalAmount())
                .status(PaymentStatus.COMPLETED)
                .paidAt(LocalDateTime.now())
                .build();

        payment = paymentRepository.save(payment);

        order.setStatus(OrderStatus.CONFIRMED);
        orderRepository.save(order);

        log.info("Payment processed for order: {} with transaction: {}", order.getId(), payment.getTransactionId());
        return mapToPaymentResponse(payment);
    }

    public PaymentResponse getPaymentByOrderId(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        if (!order.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to view this payment");
        }

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "orderId", orderId));

        return mapToPaymentResponse(payment);
    }

    private PaymentResponse mapToPaymentResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .orderId(payment.getOrder().getId())
                .method(payment.getMethod().name())
                .transactionId(payment.getTransactionId())
                .amount(payment.getAmount())
                .status(payment.getStatus().name())
                .paidAt(payment.getPaidAt())
                .build();
    }
}
