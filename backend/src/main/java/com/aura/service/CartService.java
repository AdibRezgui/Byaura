package com.aura.service;

import com.aura.model.User;
import com.aura.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class CartService {

    @Autowired
    private UserRepository userRepository;

    public Map<String, Map<String, Integer>> getCart(Long userId) {
        User user = findUser(userId);
        return user.getCartData() != null ? user.getCartData() : new HashMap<>();
    }

    public void addToCart(Long userId, String itemId, String size) {
        User user = findUser(userId);

        Map<String, Map<String, Integer>> cartData = user.getCartData();
        if (cartData == null) cartData = new HashMap<>();

        cartData.computeIfAbsent(itemId, k -> new HashMap<>())
                .merge(size, 1, Integer::sum);

        user.setCartData(cartData);
        userRepository.save(user);
    }

    public void updateCart(Long userId, String itemId, String size, Integer quantity) {
        User user = findUser(userId);

        Map<String, Map<String, Integer>> cartData = user.getCartData();
        if (cartData == null) cartData = new HashMap<>();

        if (quantity > 0) {
            cartData.computeIfAbsent(itemId, k -> new HashMap<>()).put(size, quantity);
        } else {
            Map<String, Integer> itemCart = cartData.get(itemId);
            if (itemCart != null) {
                itemCart.remove(size);
                if (itemCart.isEmpty()) {
                    cartData.remove(itemId);
                }
            }
        }

        user.setCartData(cartData);
        userRepository.save(user);
    }

    public void clearCart(Long userId) {
        User user = findUser(userId);
        user.setCartData(new HashMap<>());
        userRepository.save(user);
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
