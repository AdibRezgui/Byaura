package com.aura.controller;

import com.aura.model.Product;
import com.aura.service.ProductService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/product")
public class ProductController {

    @Autowired
    private ProductService productService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @PutMapping("/update/{id}")
    public ResponseEntity<Map<String, Object>> updateProduct(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        Map<String, Object> result = new HashMap<>();
        try {
            String sizesJson = body.get("sizes") != null ? objectMapper.writeValueAsString(body.get("sizes")) : null;
            Map<String, Integer> sizes = sizesJson != null
                    ? objectMapper.readValue(sizesJson, new TypeReference<Map<String, Integer>>() {}) : null;
            Double price = body.get("price") != null ? ((Number) body.get("price")).doubleValue() : null;
            Double salePrice = body.get("salePrice") != null ? ((Number) body.get("salePrice")).doubleValue() : null;
            Boolean bestseller = body.get("bestseller") != null ? (Boolean) body.get("bestseller") : null;
            Product updated = productService.updateProduct(id,
                    (String) body.get("name"), (String) body.get("description"),
                    (String) body.get("composition"),
                    price, (String) body.get("category"), (String) body.get("subCategory"),
                    sizes, bestseller, salePrice,
                    (String) body.get("color"), (String) body.get("colorGroup"));
            result.put("success", true);
            result.put("product", updated);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/bestsellers")
    public ResponseEntity<Map<String, Object>> getBestSellers() {
        Map<String, Object> result = new HashMap<>();
        try {
            result.put("success", true);
            result.put("products", productService.getBestSellers(5));
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> listProducts() {
        Map<String, Object> result = new HashMap<>();
        try {
            result.put("success", true);
            result.put("products", productService.listProducts());
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/single")
    public ResponseEntity<Map<String, Object>> singleProduct(@RequestBody Map<String, Object> body) {
        Map<String, Object> result = new HashMap<>();
        try {
            Long productId = Long.parseLong(body.get("productId").toString());
            Optional<Product> product = productService.findById(productId);
            if (product.isEmpty()) {
                result.put("success", false);
                result.put("message", "Product not found");
            } else {
                result.put("success", true);
                result.put("product", product.get());
            }
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping(value = "/add", consumes = "multipart/form-data")
    public ResponseEntity<Map<String, Object>> addProduct(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam(value = "composition", required = false) String composition,
            @RequestParam("price") Double price,
            @RequestParam("category") String category,
            @RequestParam("subCategory") String subCategory,
            @RequestParam("sizes") String sizesJson,
            @RequestParam(value = "bestseller", defaultValue = "false") String bestseller,
            @RequestParam(value = "salePrice", required = false) Double salePrice,
            @RequestParam(value = "color", required = false) String color,
            @RequestParam(value = "colorGroup", required = false) String colorGroup,
            @RequestParam(value = "images", required = false) MultipartFile[] files) {

        Map<String, Object> result = new HashMap<>();
        try {
            Map<String, Integer> sizes = objectMapper.readValue(sizesJson, new TypeReference<>() {});
            Boolean isBestseller = "true".equalsIgnoreCase(bestseller);

            Product product = productService.addProduct(
                    name, description, composition, price, category, subCategory, sizes, isBestseller, salePrice,
                    color, (colorGroup != null && !colorGroup.isBlank()) ? colorGroup : null, files);

            result.put("success", true);
            result.put("message", "Product added successfully");
            result.put("product", product);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/sale")
    public ResponseEntity<Map<String, Object>> setSalePrice(@RequestBody Map<String, Object> body) {
        Map<String, Object> result = new HashMap<>();
        try {
            Long id = Long.parseLong(body.get("id").toString());
            Double salePrice = body.get("salePrice") != null
                    ? Double.parseDouble(body.get("salePrice").toString())
                    : null;
            Product product = productService.setSalePrice(id, salePrice);
            result.put("success", true);
            result.put("message", salePrice != null && salePrice > 0 ? "Produit soldé" : "Solde retiré");
            result.put("product", product);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<Map<String, Object>> updateStock(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> sizes) {
        Map<String, Object> result = new HashMap<>();
        try {
            Product updated = productService.updateStock(id, sizes);
            result.put("success", true);
            result.put("product", updated);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/remove")
    public ResponseEntity<Map<String, Object>> removeProduct(@RequestBody Map<String, Object> body) {
        Map<String, Object> result = new HashMap<>();
        try {
            Long id = Long.parseLong(body.get("id").toString());
            productService.removeProduct(id);
            result.put("success", true);
            result.put("message", "Product removed successfully");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }
}
