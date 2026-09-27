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

        // COD payment remains PENDING until manually marked as completed by admin
        PaymentStatus paymentStatus = PaymentMethod.CASH_ON_DELIVERY.equals(paymentMethod)
                ? PaymentStatus.PENDING
                : PaymentStatus.COMPLETED;
        LocalDateTime paidAt = PaymentMethod.CASH_ON_DELIVERY.equals(paymentMethod)
                ? null
                : LocalDateTime.now();

        Payment payment = Payment.builder()
                .order(order)
                .method(paymentMethod)
                .transactionId(UUID.randomUUID().toString())
                .amount(order.getTotalAmount())
                .status(paymentStatus)
                .paidAt(paidAt)
                .build();

        payment = paymentRepository.save(payment);

        // For COD, order remains PENDING until payment is manually confirmed
        // For other methods, order transitions to CONFIRMED immediately
        if (!PaymentMethod.CASH_ON_DELIVERY.equals(paymentMethod)) {
            order.setStatus(OrderStatus.CONFIRMED);
            orderRepository.save(order);
        }

        log.info("Payment processed for order: {} with method: {} and status: {}",
                order.getId(), paymentMethod, paymentStatus);
        return mapToPaymentResponse(payment);
    }

    @Transactional(readOnly = true)
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

    @Transactional
    public PaymentResponse markCODPaymentAsCompleted(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment", "orderId", orderId));

        if (!PaymentMethod.CASH_ON_DELIVERY.equals(payment.getMethod())) {
            throw new BadRequestException("Payment method is not CASH_ON_DELIVERY. Cannot mark as completed.");
        }

        if (PaymentStatus.COMPLETED.equals(payment.getStatus())) {
            throw new BadRequestException("Payment is already completed.");
        }

        payment.setStatus(PaymentStatus.COMPLETED);
        payment.setPaidAt(LocalDateTime.now());
        payment = paymentRepository.save(payment);

        // Transition order from PENDING to CONFIRMED after COD payment is received
        if (OrderStatus.PENDING.equals(order.getStatus())) {
            order.setStatus(OrderStatus.CONFIRMED);
            orderRepository.save(order);
        }

        log.info("COD payment marked as completed for order: {}", orderId);
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
