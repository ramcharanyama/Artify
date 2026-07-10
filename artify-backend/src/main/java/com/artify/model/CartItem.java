package com.artify.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CartItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer quantity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    @ToString.Exclude
    private Cart cart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @ToString.Exclude
    private Product product;
}
