package com.aura.service;

import com.aura.model.Product;
import com.aura.model.Sale;
import com.aura.repository.ProductRepository;
import com.aura.repository.SaleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SaleServiceTest {

    @Mock
    private SaleRepository saleRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private SaleService saleService;

    private Sale sale;

    @BeforeEach
    void setUp() {
        sale = Sale.builder().id(1L).name("Summer Sale").active(true).productIds("[1,2]").build();
    }

    @Test
    void getActiveSale_returnsSale() {
        when(saleRepository.findFirstByActiveTrue()).thenReturn(Optional.of(sale));

        Optional<Sale> result = saleService.getActiveSale();

        assertTrue(result.isPresent());
        assertEquals("Summer Sale", result.get().getName());
    }

    @Test
    void getAllSales_returnsList() {
        when(saleRepository.findAll()).thenReturn(List.of(sale));

        List<Sale> result = saleService.getAllSales();

        assertEquals(1, result.size());
    }

    @Test
    void createSale_savesAndReturnsSale() {
        when(saleRepository.save(any(Sale.class))).thenReturn(sale);

        Sale result = saleService.createSale("Summer Sale", "2026-01-01", "2026-02-01");

        assertEquals("Summer Sale", result.getName());
        verify(saleRepository).save(any(Sale.class));
    }

    @Test
    void updateSale_updatesFields() throws Exception {
        when(saleRepository.findById(1L)).thenReturn(Optional.of(sale));
        when(saleRepository.save(any(Sale.class))).thenAnswer(inv -> inv.getArgument(0));

        Sale result = saleService.updateSale(1L, "New Name", "2026-03-01", "2026-04-01", false);

        assertEquals("New Name", result.getName());
        assertFalse(result.isActive());
    }

    @Test
    void updateSale_throwsWhenNotFound() {
        when(saleRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(Exception.class, () -> saleService.updateSale(99L, "X", null, null, null));
    }

    @Test
    void deleteSale_callsRepository() {
        saleService.deleteSale(1L);

        verify(saleRepository).deleteById(1L);
    }

    @Test
    void addProduct_addsNewProductId() throws Exception {
        when(saleRepository.findById(1L)).thenReturn(Optional.of(sale));
        when(saleRepository.save(any(Sale.class))).thenAnswer(inv -> inv.getArgument(0));

        Sale result = saleService.addProduct(1L, 3L);

        assertTrue(result.getProductIds().contains("3"));
    }

    @Test
    void addProduct_throwsWhenSaleNotFound() {
        when(saleRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(Exception.class, () -> saleService.addProduct(99L, 1L));
    }

    @Test
    void removeProduct_removesProductId() throws Exception {
        when(saleRepository.findById(1L)).thenReturn(Optional.of(sale));
        when(saleRepository.save(any(Sale.class))).thenAnswer(inv -> inv.getArgument(0));

        Sale result = saleService.removeProduct(1L, 1L);

        assertFalse(result.getProductIds().contains("1"));
    }

    @Test
    void getSaleProducts_returnsProducts() throws Exception {
        when(saleRepository.findById(1L)).thenReturn(Optional.of(sale));
        Product product = Product.builder().id(1L).name("Shirt").build();
        when(productRepository.findAllById(any())).thenReturn(List.of(product));

        List<Product> result = saleService.getSaleProducts(1L);

        assertEquals(1, result.size());
    }

    @Test
    void getSaleProducts_returnsEmptyWhenNoIds() throws Exception {
        Sale emptySale = Sale.builder().id(2L).name("Empty").active(false).productIds("[]").build();
        when(saleRepository.findById(2L)).thenReturn(Optional.of(emptySale));

        List<Product> result = saleService.getSaleProducts(2L);

        assertTrue(result.isEmpty());
    }

    @Test
    void getActiveSaleProducts_returnsProducts() throws Exception {
        when(saleRepository.findFirstByActiveTrue()).thenReturn(Optional.of(sale));
        Product product = Product.builder().id(1L).name("Shirt").build();
        when(productRepository.findAllById(any())).thenReturn(List.of(product));

        List<Product> result = saleService.getActiveSaleProducts();

        assertEquals(1, result.size());
    }

    @Test
    void getActiveSaleProducts_returnsEmptyWhenNoActiveSale() throws Exception {
        when(saleRepository.findFirstByActiveTrue()).thenReturn(Optional.empty());

        List<Product> result = saleService.getActiveSaleProducts();

        assertTrue(result.isEmpty());
    }
}
