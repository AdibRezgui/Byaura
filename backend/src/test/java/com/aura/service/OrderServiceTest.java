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

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CartService cartService;

    @InjectMocks
    private OrderService orderService;

    @Test
    void placeOrder_decrementsStockAndSavesOrder() {
        Map<String, Integer> sizes = new HashMap<>(Map.of("M", 10));
        Product product = Product.builder().id(1L).name("Shirt").sizes(sizes).build();
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenAnswer(inv -> inv.getArgument(0));
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        List<Map<String, Object>> items = List.of(
                Map.of("_id", "1", "size", "M", "quantity", 3)
        );
        Map<String, Object> address = Map.of("city", "Tunis");

        Order result = orderService.placeOrder(5L, items, 99.0, address, "COD");

        assertThat(product.getSizes().get("M")).isEqualTo(7);
        assertThat(result.getUserId()).isEqualTo(5L);
        assertThat(result.getStatus()).isEqualTo("Order Placed");
        assertThat(result.getPaymentMethod()).isEqualTo("COD");
        verify(cartService).clearCart(5L);
    }

    @Test
    void placeOrder_defaultsPaymentMethodToCOD() {
        Map<String, Integer> sizes = new HashMap<>(Map.of("M", 10));
        Product product = Product.builder().id(1L).name("Shirt").sizes(sizes).build();
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenAnswer(inv -> inv.getArgument(0));
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        List<Map<String, Object>> items = List.of(
                Map.of("_id", "1", "size", "M", "quantity", 1)
        );

        Order result = orderService.placeOrder(5L, items, 50.0, Map.of(), null);

        assertThat(result.getPaymentMethod()).isEqualTo("COD");
    }

    @Test
    void placeOrder_throwsWhenStockInsufficient() {
        Map<String, Integer> sizes = new HashMap<>(Map.of("M", 1));
        Product product = Product.builder().id(1L).name("Shirt").sizes(sizes).build();
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        List<Map<String, Object>> items = List.of(
                Map.of("_id", "1", "size", "M", "quantity", 5)
        );

        org.junit.jupiter.api.Assertions.assertThrows(RuntimeException.class,
                () -> orderService.placeOrder(5L, items, 50.0, Map.of(), "COD"));

        verify(orderRepository, never()).save(any());
    }

    @Test
    void placeOrder_throwsWhenProductNotFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        List<Map<String, Object>> items = List.of(
                Map.of("_id", "99", "size", "M", "quantity", 1)
        );

        org.junit.jupiter.api.Assertions.assertThrows(RuntimeException.class,
                () -> orderService.placeOrder(5L, items, 50.0, Map.of(), "COD"));
    }

    @Test
    void getAllOrders_returnsAllOrders() {
        Order order = Order.builder().id(1L).build();
        when(orderRepository.findAll()).thenReturn(List.of(order));

        List<Order> result = orderService.getAllOrders();

        assertThat(result).containsExactly(order);
    }

    @Test
    void getUserOrders_returnsOrdersForUser() {
        Order order = Order.builder().id(1L).userId(5L).build();
        when(orderRepository.findByUserId(5L)).thenReturn(List.of(order));

        List<Order> result = orderService.getUserOrders(5L);

        assertThat(result).containsExactly(order);
    }

    @Test
    void updateOrderStatus_updatesAndSaves() {
        Order order = Order.builder().id(1L).status("Order Placed").build();
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        orderService.updateOrderStatus(1L, "Shipped");

        assertThat(order.getStatus()).isEqualTo("Shipped");
        verify(orderRepository).save(order);
    }

    @Test
    void updateOrderStatus_throwsWhenNotFound() {
        when(orderRepository.findById(99L)).thenReturn(Optional.empty());

        org.junit.jupiter.api.Assertions.assertThrows(RuntimeException.class,
                () -> orderService.updateOrderStatus(99L, "Shipped"));
    }
}
