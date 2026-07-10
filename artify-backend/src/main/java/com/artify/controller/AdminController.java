package com.artify.controller;

import com.artify.dto.response.ApiResponse;
import com.artify.dto.response.PagedResponse;
import com.artify.dto.response.ProductResponse;
import com.artify.dto.response.UserResponse;
import com.artify.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> response = adminService.getAllUsers();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String role = request.get("role");
        UserResponse response = adminService.updateUserRole(id, role);
        return ResponseEntity.ok(ApiResponse.success("User role updated successfully", response));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }

    @GetMapping("/products")
    public ResponseEntity<PagedResponse<ProductResponse>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<ProductResponse> response = adminService.getAllProducts(page, size);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        adminService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", null));
    }

    @GetMapping("/reports/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getReportSummary() {
        Map<String, Object> report = adminService.getReportSummary();
        return ResponseEntity.ok(ApiResponse.success("Report summary retrieved successfully", report));
    }
}
