-- =============================================================================
-- ARTIFY — Database Schema
-- MySQL 8.0+
-- =============================================================================
-- Run this script to create the database and all tables.
-- Usage: mysql -u root -p < schema.sql
-- =============================================================================

CREATE DATABASE IF NOT EXISTS artify_db
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE artify_db;

-- -----------------------------------------------------------------------------
-- 1. USERS
-- -----------------------------------------------------------------------------
CREATE TABLE users (
    id              BIGINT          AUTO_INCREMENT PRIMARY KEY,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL,
    name            VARCHAR(100)    NOT NULL,
    phone           VARCHAR(20),
    address         TEXT,
    avatar_url      VARCHAR(500),
    role            ENUM('CUSTOMER', 'ARTIST', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER',
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 2. ARTISTS  (1:1 with users where role = 'ARTIST')
-- -----------------------------------------------------------------------------
CREATE TABLE artists (
    id              BIGINT          AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT          NOT NULL UNIQUE,
    bio             TEXT,
    portfolio_url   VARCHAR(500),
    is_verified     BOOLEAN         DEFAULT FALSE,
    rating          DECIMAL(2,1)    DEFAULT 0.0,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_artist_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 3. CATEGORIES
-- -----------------------------------------------------------------------------
CREATE TABLE categories (
    id              BIGINT          AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL UNIQUE,
    description     TEXT,
    image_url       VARCHAR(500),
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 4. PRODUCTS
-- -----------------------------------------------------------------------------
CREATE TABLE products (
    id              BIGINT          AUTO_INCREMENT PRIMARY KEY,
    artist_id       BIGINT          NOT NULL,
    category_id     BIGINT          NOT NULL,
    title           VARCHAR(200)    NOT NULL,
    description     TEXT,
    price           DECIMAL(10,2)   NOT NULL,
    image_url       VARCHAR(500),
    stock           INT             NOT NULL DEFAULT 1,
    status          ENUM('ACTIVE', 'SOLD', 'DRAFT') NOT NULL DEFAULT 'ACTIVE',
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_product_artist   FOREIGN KEY (artist_id)   REFERENCES artists(id)    ON DELETE CASCADE,
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 5. CART  (one cart per user)
-- -----------------------------------------------------------------------------
CREATE TABLE cart (
    id              BIGINT          AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT          NOT NULL UNIQUE,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 6. CART_ITEMS
-- -----------------------------------------------------------------------------
CREATE TABLE cart_items (
    id              BIGINT          AUTO_INCREMENT PRIMARY KEY,
    cart_id         BIGINT          NOT NULL,
    product_id      BIGINT          NOT NULL,
    quantity        INT             NOT NULL DEFAULT 1,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cartitem_cart    FOREIGN KEY (cart_id)    REFERENCES cart(id)     ON DELETE CASCADE,
    CONSTRAINT fk_cartitem_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY uk_cart_product (cart_id, product_id)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 7. ORDERS
-- -----------------------------------------------------------------------------
CREATE TABLE orders (
    id                  BIGINT          AUTO_INCREMENT PRIMARY KEY,
    user_id             BIGINT          NOT NULL,
    total_amount        DECIMAL(10,2)   NOT NULL,
    status              ENUM('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    shipping_address    TEXT            NOT NULL,
    created_at          TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 8. ORDER_ITEMS
-- -----------------------------------------------------------------------------
CREATE TABLE order_items (
    id                  BIGINT          AUTO_INCREMENT PRIMARY KEY,
    order_id            BIGINT          NOT NULL,
    product_id          BIGINT          NOT NULL,
    quantity            INT             NOT NULL DEFAULT 1,
    price_at_purchase   DECIMAL(10,2)   NOT NULL,
    CONSTRAINT fk_orderitem_order   FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
    CONSTRAINT fk_orderitem_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 9. PAYMENTS  (1:1 with orders)
-- -----------------------------------------------------------------------------
CREATE TABLE payments (
    id                  BIGINT          AUTO_INCREMENT PRIMARY KEY,
    order_id            BIGINT          NOT NULL UNIQUE,
    method              ENUM('CREDIT_CARD', 'DEBIT_CARD', 'UPI', 'NET_BANKING', 'WALLET') NOT NULL,
    transaction_id      VARCHAR(255),
    amount              DECIMAL(10,2)   NOT NULL,
    status              ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    paid_at             TIMESTAMP       NULL,
    created_at          TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 10. REVIEWS  (unique per user+product pair)
-- -----------------------------------------------------------------------------
CREATE TABLE reviews (
    id              BIGINT          AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT          NOT NULL,
    product_id      BIGINT          NOT NULL,
    rating          INT             NOT NULL,
    comment         TEXT,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_user    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
    CONSTRAINT fk_review_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5),
    UNIQUE KEY uk_user_product_review (user_id, product_id)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- INDEXES for query performance
-- -----------------------------------------------------------------------------
CREATE INDEX idx_products_artist   ON products(artist_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_status   ON products(status);
CREATE INDEX idx_products_title    ON products(title);
CREATE INDEX idx_orders_user       ON orders(user_id);
CREATE INDEX idx_orders_status     ON orders(status);
CREATE INDEX idx_reviews_product   ON reviews(product_id);
