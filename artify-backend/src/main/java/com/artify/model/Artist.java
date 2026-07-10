package com.artify.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "artists")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Artist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String portfolioUrl;

    @Builder.Default
    private Boolean isVerified = false;

    @Builder.Default
    private Double rating = 0.0;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @ToString.Exclude
    private User user;

    @OneToMany(mappedBy = "artist", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @Builder.Default
    private List<Product> products = new ArrayList<>();
}
