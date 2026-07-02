package com.aura.service;

import com.aura.model.Order;
import com.aura.model.Product;
import com.aura.repository.OrderRepository;
import com.aura.repository.ProductRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartService cartService;

    @Transactional
    public Order placeOrder(Long userId,
                            List<Map<String, Object>> items,
                            Double amount,
                            Map<String, Object> address,
                            String paymentMethod) {

        // Decrement stock for each item before saving the order
        for (Map<String, Object> item : items) {
            Object rawId = item.get("_id");
            if (rawId == null) rawId = item.get("id");
            if (rawId == null) continue;

            Long productId = Long.parseLong(rawId.toString());
            String size = (String) item.get("size");
            int quantity = ((Number) item.get("quantity")).intValue();

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Produit introuvable : " + productId));

            Map<String, Integer> stock = product.getSizes();
            int currentStock = stock.getOrDefault(size, 0);

            if (currentStock < quantity) {
                throw new RuntimeException(
                        "Stock insuffisant pour " + product.getName() + " (taille " + size + ")"
                        + " — disponible : " + currentStock + ", demandé : " + quantity
                );
            }

            stock.put(size, currentStock - quantity);
            product.setSizes(stock);
            productRepository.save(product);
        }

        Order order = Order.builder()
                .userId(userId)
                .items(items)
                .amount(amount)
                .address(address)
                .paymentMethod(paymentMethod != null ? paymentMethod : "COD")
                .payment(false)
                .status("Order Placed")
                .date(System.currentTimeMillis())
                .build();

        order = orderRepository.save(order);
        cartService.clearCart(userId);
        return order;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findByArchivedFalseOrderByDateDesc();
    }

    public List<Order> getArchivedOrders() {
        return orderRepository.findByArchivedTrueOrderByDateDesc();
    }

    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserIdAndArchivedFalse(userId);
    }

    public void updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
        order.setStatus(status);
        orderRepository.save(order);
    }

    public void archiveOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande introuvable : " + orderId));
        if (!"Delivered".equals(order.getStatus())) {
            throw new RuntimeException("Seules les commandes livrées peuvent être archivées.");
        }
        order.setArchived(true);
        orderRepository.save(order);
    }
}
