package com.aura.service;

import com.aura.model.User;
import com.aura.repository.UserRepository;
import com.aura.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(userService, "adminEmail", "admin@example.com");
        ReflectionTestUtils.setField(userService, "adminPassword", "adminpass");
    }

    @Test
    void register_failsWhenEmailAlreadyExists() {
        when(userRepository.existsByEmail("john@example.com")).thenReturn(true);

        Map<String, Object> result = userService.register("John", "john@example.com", "password123");

        assertThat(result.get("success")).isEqualTo(false);
        assertThat(result.get("message")).isEqualTo("User already exists");
        verify(userRepository, never()).save(any());
    }

    @Test
    void register_failsForInvalidEmail() {
        when(userRepository.existsByEmail("not-an-email")).thenReturn(false);

        Map<String, Object> result = userService.register("John", "not-an-email", "password123");

        assertThat(result.get("success")).isEqualTo(false);
        assertThat(result.get("message")).isEqualTo("Invalid email");
    }

    @Test
    void register_failsForShortPassword() {
        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);

        Map<String, Object> result = userService.register("John", "john@example.com", "short");

        assertThat(result.get("success")).isEqualTo(false);
        assertThat(result.get("message")).isEqualTo("Password too short");
    }

    @Test
    void register_succeedsAndReturnsToken() {
        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(1L);
            return u;
        });
        when(jwtUtil.generateUserToken(1L)).thenReturn("jwt-token");

        Map<String, Object> result = userService.register("John", "john@example.com", "password123");

        assertThat(result.get("success")).isEqualTo(true);
        assertThat(result.get("token")).isEqualTo("jwt-token");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void login_failsWhenUserNotFound() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        Map<String, Object> result = userService.login("missing@example.com", "password123");

        assertThat(result.get("success")).isEqualTo(false);
        assertThat(result.get("message")).isEqualTo("User doesn't exist");
    }

    @Test
    void login_failsWhenPasswordDoesNotMatch() {
        User user = User.builder().id(1L).email("john@example.com").password("hashed").build();
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongpass", "hashed")).thenReturn(false);

        Map<String, Object> result = userService.login("john@example.com", "wrongpass");

        assertThat(result.get("success")).isEqualTo(false);
        assertThat(result.get("message")).isEqualTo("Invalid credentials");
    }

    @Test
    void login_succeedsAndReturnsToken() {
        User user = User.builder().id(1L).email("john@example.com").password("hashed").build();
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", "hashed")).thenReturn(true);
        when(jwtUtil.generateUserToken(1L)).thenReturn("jwt-token");

        Map<String, Object> result = userService.login("john@example.com", "password123");

        assertThat(result.get("success")).isEqualTo(true);
        assertThat(result.get("token")).isEqualTo("jwt-token");
    }

    @Test
    void adminLogin_succeedsWithCorrectCredentials() {
        when(jwtUtil.generateAdminToken("admin@example.com", "adminpass")).thenReturn("admin-token");

        Map<String, Object> result = userService.adminLogin("admin@example.com", "adminpass");

        assertThat(result.get("success")).isEqualTo(true);
        assertThat(result.get("token")).isEqualTo("admin-token");
    }

    @Test
    void adminLogin_failsWithIncorrectCredentials() {
        Map<String, Object> result = userService.adminLogin("admin@example.com", "wrongpass");

        assertThat(result.get("success")).isEqualTo(false);
        assertThat(result.get("message")).isEqualTo("Invalid credentials");
    }

    @Test
    void findById_returnsUser() {
        User user = User.builder().id(1L).email("john@example.com").build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        User found = userService.findById(1L);

        assertThat(found).isEqualTo(user);
    }

    @Test
    void findById_throwsWhenNotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        org.junit.jupiter.api.Assertions.assertThrows(RuntimeException.class,
                () -> userService.findById(99L));
    }

    @Test
    void getProfile_returnsExpectedFields() {
        User user = User.builder().id(1L).name("John").email("john@example.com").profileImage("/img.png").build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        Map<String, Object> result = userService.getProfile(1L);

        assertThat(result.get("name")).isEqualTo("John");
        assertThat(result.get("email")).isEqualTo("john@example.com");
        assertThat(result.get("profileImage")).isEqualTo("/img.png");
    }

    @Test
    void updateProfile_updatesNameOnly() {
        User user = User.builder().id(1L).name("John").password("hashed").build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        Map<String, Object> result = userService.updateProfile(1L, "Johnny", null, null);

        assertThat(result.get("success")).isEqualTo(true);
        assertThat(user.getName()).isEqualTo("Johnny");
        verify(userRepository).save(user);
    }

    @Test
    void updateProfile_failsWhenCurrentPasswordWrong() {
        User user = User.builder().id(1L).name("John").password("hashed").build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "hashed")).thenReturn(false);

        Map<String, Object> result = userService.updateProfile(1L, null, "wrong", "newpassword1");

        assertThat(result.get("success")).isEqualTo(false);
        assertThat(result.get("message")).isEqualTo("Mot de passe actuel incorrect");
    }

    @Test
    void updateProfile_failsWhenNewPasswordTooShort() {
        User user = User.builder().id(1L).name("John").password("hashed").build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("current", "hashed")).thenReturn(true);

        Map<String, Object> result = userService.updateProfile(1L, null, "current", "short");

        assertThat(result.get("success")).isEqualTo(false);
        assertThat(result.get("message")).isEqualTo("Nouveau mot de passe trop court (8 caractères min.)");
    }

    @Test
    void updateProfile_updatesPasswordWhenValid() {
        User user = User.builder().id(1L).name("John").password("hashed").build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("current", "hashed")).thenReturn(true);
        when(passwordEncoder.encode("newpassword1")).thenReturn("newhashed");

        Map<String, Object> result = userService.updateProfile(1L, null, "current", "newpassword1");

        assertThat(result.get("success")).isEqualTo(true);
        assertThat(user.getPassword()).isEqualTo("newhashed");
        verify(userRepository).save(user);
    }

    @Test
    void save_delegatesToRepository() {
        User user = User.builder().id(1L).build();

        userService.save(user);

        verify(userRepository).save(user);
    }
}
