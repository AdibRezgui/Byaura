package com.aura.service;

import com.aura.model.Product;
import com.aura.model.Sale;
import com.aura.repository.ProductRepository;
import com.aura.repository.SaleRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class SaleService {

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private ProductRepository productRepository;

    private final ObjectMapper mapper = new ObjectMapper();

    public Optional<Sale> getActiveSale() {
        return saleRepository.findFirstByActiveTrue();
    }

    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }

    public Sale createSale(String name, String startDate, String endDate) {
        Sale sale = Sale.builder()
                .name(name)
                .startDate(startDate)
                .endDate(endDate)
                .active(false)
                .productIds("[]")
                .build();
        return saleRepository.save(sale);
    }

    public Sale updateSale(Long id, String name, String startDate, String endDate, Boolean active) throws Exception {
        Sale sale = saleRepository.findById(id).orElseThrow(() -> new Exception("Solde introuvable"));
        if (name != null) sale.setName(name);
        if (startDate != null) sale.setStartDate(startDate);
        if (endDate != null) sale.setEndDate(endDate);
        if (active != null) sale.setActive(active);
        return saleRepository.save(sale);
    }

    public void deleteSale(Long id) {
        saleRepository.deleteById(id);
    }

    public Sale addProduct(Long saleId, Long productId) throws Exception {
        Sale sale = saleRepository.findById(saleId).orElseThrow(() -> new Exception("Solde introuvable"));
        List<Long> ids = parseIds(sale.getProductIds());
        if (!ids.contains(productId)) ids.add(productId);
        sale.setProductIds(mapper.writeValueAsString(ids));
        return saleRepository.save(sale);
    }

    public Sale removeProduct(Long saleId, Long productId) throws Exception {
        Sale sale = saleRepository.findById(saleId).orElseThrow(() -> new Exception("Solde introuvable"));
        List<Long> ids = parseIds(sale.getProductIds());
        ids.remove(productId);
        sale.setProductIds(mapper.writeValueAsString(ids));
        return saleRepository.save(sale);
    }

    public List<Product> getSaleProducts(Long saleId) throws Exception {
        Sale sale = saleRepository.findById(saleId).orElseThrow(() -> new Exception("Solde introuvable"));
        List<Long> ids = parseIds(sale.getProductIds());
        if (ids.isEmpty()) return List.of();
        return productRepository.findAllById(ids);
    }

    public List<Product> getActiveSaleProducts() throws Exception {
        Optional<Sale> activeSale = saleRepository.findFirstByActiveTrue();
        if (activeSale.isEmpty()) return List.of();
        List<Long> ids = parseIds(activeSale.get().getProductIds());
        if (ids.isEmpty()) return List.of();
        return productRepository.findAllById(ids);
    }

    private List<Long> parseIds(String json) throws Exception {
        if (json == null || json.isBlank()) return new ArrayList<>();
        return new ArrayList<>(mapper.readValue(json, new TypeReference<List<Long>>() {}));
    }
}
