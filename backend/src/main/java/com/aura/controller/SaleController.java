package com.aura.controller;

import com.aura.model.Product;
import com.aura.model.Sale;
import com.aura.service.SaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/sale")
public class SaleController {

    @Autowired
    private SaleService saleService;

    @GetMapping("/active")
    public ResponseEntity<Map<String, Object>> getActiveSale() {
        Map<String, Object> result = new HashMap<>();
        try {
            Optional<Sale> activeSale = saleService.getActiveSale();
            if (activeSale.isPresent()) {
                List<Product> products = saleService.getActiveSaleProducts();
                result.put("success", true);
                result.put("sale", activeSale.get());
                result.put("products", products);
            } else {
                result.put("success", true);
                result.put("sale", null);
                result.put("products", List.of());
            }
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/all")
    public ResponseEntity<Map<String, Object>> getAllSales() {
        Map<String, Object> result = new HashMap<>();
        try {
            result.put("success", true);
            result.put("sales", saleService.getAllSales());
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createSale(@RequestBody Map<String, String> body) {
        Map<String, Object> result = new HashMap<>();
        try {
            Sale sale = saleService.createSale(body.get("name"), body.get("startDate"), body.get("endDate"));
            result.put("success", true);
            result.put("sale", sale);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateSale(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Map<String, Object> result = new HashMap<>();
        try {
            String name = (String) body.get("name");
            String startDate = (String) body.get("startDate");
            String endDate = (String) body.get("endDate");
            Boolean active = body.get("active") != null ? (Boolean) body.get("active") : null;
            Sale sale = saleService.updateSale(id, name, startDate, endDate, active);
            result.put("success", true);
            result.put("sale", sale);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteSale(@PathVariable Long id) {
        Map<String, Object> result = new HashMap<>();
        try {
            saleService.deleteSale(id);
            result.put("success", true);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}/products")
    public ResponseEntity<Map<String, Object>> getSaleProducts(@PathVariable Long id) {
        Map<String, Object> result = new HashMap<>();
        try {
            result.put("success", true);
            result.put("products", saleService.getSaleProducts(id));
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{id}/product/{productId}")
    public ResponseEntity<Map<String, Object>> addProduct(@PathVariable Long id, @PathVariable Long productId) {
        Map<String, Object> result = new HashMap<>();
        try {
            Sale sale = saleService.addProduct(id, productId);
            result.put("success", true);
            result.put("sale", sale);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}/product/{productId}")
    public ResponseEntity<Map<String, Object>> removeProduct(@PathVariable Long id, @PathVariable Long productId) {
        Map<String, Object> result = new HashMap<>();
        try {
            Sale sale = saleService.removeProduct(id, productId);
            result.put("success", true);
            result.put("sale", sale);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", e.getMessage());
        }
        return ResponseEntity.ok(result);
    }
}
