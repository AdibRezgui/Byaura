package com.aura.service;

import com.aura.model.Order;
import com.aura.model.Product;
import com.aura.repository.OrderRepository;
import com.aura.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private ProductService productService;

    @Test
    void listProducts_returnsAllProducts() {
        Product p1 = Product.builder().id(1L).name("Shirt").build();
        when(productRepository.findAll()).thenReturn(List.of(p1));

        List<Product> result = productService.listProducts();

        assertThat(result).hasSize(1).contains(p1);
    }

    @Test
    void findById_returnsProductWhenPresent() {
        Product p1 = Product.builder().id(1L).name("Shirt").build();
        when(productRepository.findById(1L)).thenReturn(Optional.of(p1));

        Optional<Product> result = productService.findById(1L);

        assertThat(result).contains(p1);
    }

    @Test
    void addProduct_buildsProductWithNoFiles() throws Exception {
        Map<String, Integer> sizes = new HashMap<>();
        sizes.put("M", 5);
        when(productRepository.save(any(Product.class))).thenAnswer(inv -> inv.getArgument(0));

        Product result = productService.addProduct("Shirt", "desc", "cotton", 29.99,
                "men", "shirts", sizes, true, 19.99, "#000000", "black", null);

        assertThat(result.getName()).isEqualTo("Shirt");
        assertThat(result.getBestseller()).isTrue();
        assertThat(result.getSalePrice()).isEqualTo(19.99);
        assertThat(result.getImages()).isEmpty();
    }

    @Test
    void addProduct_nullSalePriceWhenZeroOrNegative() throws Exception {
        Map<String, Integer> sizes = new HashMap<>();
        when(productRepository.save(any(Product.class))).thenAnswer(inv -> inv.getArgument(0));

        Product result = productService.addProduct("Shirt", "desc", "cotton", 29.99,
                "men", "shirts", sizes, false, 0.0, "#000000", "black", null);

        assertThat(result.getSalePrice()).isNull();
    }

    @Test
    void getBestSellers_ranksByQuantitySold() {
        Order order1 = Order.builder().id(1L).items(List.of(
                Map.of("itemId", "1", "quantity", 3),
                Map.of("itemId", "2", "quantity", 1)
        )).build();
        Order order2 = Order.builder().id(2L).items(List.of(
                Map.of("itemId", "1", "quantity", 2)
        )).build();
        when(orderRepository.findAll()).thenReturn(List.of(order1, order2));

        Product product1 = Product.builder().id(1L).name("Top seller").build();
        Product product2 = Product.builder().id(2L).name("Second").build();
        when(productRepository.findById(1L)).thenReturn(Optional.of(product1));
        when(productRepository.findById(2L)).thenReturn(Optional.of(product2));

        List<Product> result = productService.getBestSellers(5);

        assertThat(result).hasSize(2);
        assertThat(result.get(0)).isEqualTo(product1);
        assertThat(result.get(1)).isEqualTo(product2);
    }

    @Test
    void getBestSellers_ignoresMalformedItems() {
        Order order = Order.builder().id(1L).items(List.of(
                new HashMap<>(Map.of("itemId", "not-a-number"))
        )).build();
        when(orderRepository.findAll()).thenReturn(List.of(order));

        List<Product> result = productService.getBestSellers(5);

        assertThat(result).isEmpty();
    }

    @Test
    void getBestSellers_respectsLimit() {
        List<Order> orders = new ArrayList<>();
        for (long i = 1; i <= 3; i++) {
            orders.add(Order.builder().id(i).items(List.of(
                    Map.of("itemId", String.valueOf(i), "quantity", (int) i)
            )).build());
        }
        when(orderRepository.findAll()).thenReturn(orders);
        when(productRepository.findById(any(Long.class)))
                .thenAnswer(inv -> Optional.of(Product.builder().id(inv.getArgument(0)).build()));

        List<Product> result = productService.getBestSellers(2);

        assertThat(result).hasSize(2);
    }

    @Test
    void updateProduct_updatesProvidedFields() {
        Product existing = Product.builder().id(1L).name("Old").price(10.0)
                .category("men").subCategory("shirts").sizes(new HashMap<>()).build();
        when(productRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(productRepository.save(any(Product.class))).thenAnswer(inv -> inv.getArgument(0));

        Product result = productService.updateProduct(1L, "New", "new desc", "wool", 25.0,
                "women", "dresses", Map.of("L", 3), true, 15.0, "#fff", "white");

        assertThat(result.getName()).isEqualTo("New");
        assertThat(result.getPrice()).isEqualTo(25.0);
        assertThat(result.getCategory()).isEqualTo("women");
        assertThat(result.getSalePrice()).isEqualTo(15.0);
    }

    @Test
    void updateProduct_throwsWhenNotFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        org.junit.jupiter.api.Assertions.assertThrows(RuntimeException.class,
                () -> productService.updateProduct(99L, null, null, null, null, null, null, null, null, null, null, null));
    }

    @Test
    void removeProduct_delegatesToRepository() {
        productService.removeProduct(1L);

        verify(productRepository).deleteById(1L);
    }

    @Test
    void setSalePrice_setsValueWhenPositive() {
        Product existing = Product.builder().id(1L).build();
        when(productRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(productRepository.save(any(Product.class))).thenAnswer(inv -> inv.getArgument(0));

        Product result = productService.setSalePrice(1L, 9.99);

        assertThat(result.getSalePrice()).isEqualTo(9.99);
    }

    @Test
    void setSalePrice_clearsValueWhenZero() {
        Product existing = Product.builder().id(1L).salePrice(9.99).build();
        when(productRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(productRepository.save(any(Product.class))).thenAnswer(inv -> inv.getArgument(0));

        Product result = productService.setSalePrice(1L, 0.0);

        assertThat(result.getSalePrice()).isNull();
    }
}
