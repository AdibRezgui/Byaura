package com.aura.service;

import com.aura.model.User;
import com.aura.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CartService cartService;

    @Test
    void getCart_returnsEmptyMapWhenNoCartData() {
        User user = User.builder().id(1L).cartData(null).build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        Map<String, Map<String, Integer>> cart = cartService.getCart(1L);

        assertThat(cart).isEmpty();
    }

    @Test
    void getCart_returnsExistingCartData() {
        Map<String, Map<String, Integer>> data = new HashMap<>();
        data.put("item1", new HashMap<>(Map.of("M", 2)));
        User user = User.builder().id(1L).cartData(data).build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        Map<String, Map<String, Integer>> cart = cartService.getCart(1L);

        assertThat(cart).isEqualTo(data);
    }

    @Test
    void addToCart_createsNewItemEntry() {
        User user = User.builder().id(1L).cartData(new HashMap<>()).build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        cartService.addToCart(1L, "item1", "M");

        assertThat(user.getCartData().get("item1").get("M")).isEqualTo(1);
        verify(userRepository).save(user);
    }

    @Test
    void addToCart_incrementsExistingQuantity() {
        Map<String, Map<String, Integer>> data = new HashMap<>();
        data.put("item1", new HashMap<>(Map.of("M", 2)));
        User user = User.builder().id(1L).cartData(data).build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        cartService.addToCart(1L, "item1", "M");

        assertThat(user.getCartData().get("item1").get("M")).isEqualTo(3);
    }

    @Test
    void updateCart_setsQuantityWhenPositive() {
        User user = User.builder().id(1L).cartData(new HashMap<>()).build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        cartService.updateCart(1L, "item1", "M", 5);

        assertThat(user.getCartData().get("item1").get("M")).isEqualTo(5);
    }

    @Test
    void updateCart_removesSizeWhenQuantityZero() {
        Map<String, Map<String, Integer>> data = new HashMap<>();
        data.put("item1", new HashMap<>(Map.of("M", 2, "L", 1)));
        User user = User.builder().id(1L).cartData(data).build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        cartService.updateCart(1L, "item1", "M", 0);

        assertThat(user.getCartData().get("item1")).doesNotContainKey("M");
        assertThat(user.getCartData().get("item1")).containsKey("L");
    }

    @Test
    void updateCart_removesItemWhenLastSizeRemoved() {
        Map<String, Map<String, Integer>> data = new HashMap<>();
        data.put("item1", new HashMap<>(Map.of("M", 2)));
        User user = User.builder().id(1L).cartData(data).build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        cartService.updateCart(1L, "item1", "M", 0);

        assertThat(user.getCartData()).doesNotContainKey("item1");
    }

    @Test
    void clearCart_emptiesCartData() {
        Map<String, Map<String, Integer>> data = new HashMap<>();
        data.put("item1", new HashMap<>(Map.of("M", 2)));
        User user = User.builder().id(1L).cartData(data).build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        cartService.clearCart(1L);

        assertThat(user.getCartData()).isEmpty();
        verify(userRepository).save(user);
    }

    @Test
    void findUser_throwsWhenNotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        org.junit.jupiter.api.Assertions.assertThrows(RuntimeException.class,
                () -> cartService.getCart(99L));
    }
}
