package com.aura.service;

import com.aura.model.Order;
import com.aura.model.Product;
import com.aura.repository.OrderRepository;
import com.aura.repository.ProductRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.Map;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private Cloudinary cloudinary;

    @Value("${upload.dir:uploads}")
    private String uploadDir;

    public List<Product> listProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> findById(Long id) {
        return productRepository.findById(id);
    }

    public Product addProduct(String name, String description, String composition, Double price,
                              String category, String subCategory,
                              Map<String, Integer> sizes, Boolean bestseller,
                              Double salePrice, String color, String colorGroup,
                              MultipartFile[] files) throws IOException {

        List<String> imageUrls = new ArrayList<>();

        if (files != null) {
            for (MultipartFile file : files) {
                if (file != null && !file.isEmpty()) {
                    String url = uploadImage(file);
                    if (url != null) {
                        imageUrls.add(url);
                    }
                }
            }
        }

        Product product = Product.builder()
                .name(name)
                .description(description)
                .composition(composition)
                .price(price)
                .category(category)
                .subCategory(subCategory)
                .sizes(sizes)
                .bestseller(bestseller != null && bestseller)
                .images(imageUrls)
                .date(System.currentTimeMillis())
                .salePrice((salePrice != null && salePrice > 0) ? salePrice : null)
                .color(color)
                .colorGroup(colorGroup)
                .build();

        return productRepository.save(product);
    }

    public List<Product> getBestSellers(int limit) {
        List<Order> orders = orderRepository.findAll();
        Map<Long, Integer> salesCount = new HashMap<>();

        for (Order order : orders) {
            for (Map<String, Object> item : order.getItems()) {
                try {
                    Long productId = Long.parseLong(item.get("itemId").toString());
                    int qty = item.get("quantity") != null
                            ? ((Number) item.get("quantity")).intValue() : 1;
                    salesCount.merge(productId, qty, Integer::sum);
                } catch (Exception ignored) {}
            }
        }

        return salesCount.entrySet().stream()
                .sorted(Map.Entry.<Long, Integer>comparingByValue().reversed())
                .limit(limit)
                .map(e -> productRepository.findById(e.getKey()).orElse(null))
                .filter(p -> p != null)
                .toList();
    }

    public Product updateProduct(Long id, String name, String description, String composition, Double price,
                               String category, String subCategory,
                               Map<String, Integer> sizes, Boolean bestseller, Double salePrice,
                               String color, String colorGroup) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));
        if (name != null && !name.isBlank()) product.setName(name);
        if (description != null) product.setDescription(description);
        if (composition != null) product.setComposition(composition);
        if (price != null && price > 0) product.setPrice(price);
        if (category != null && !category.isBlank()) product.setCategory(category);
        if (subCategory != null && !subCategory.isBlank()) product.setSubCategory(subCategory);
        if (sizes != null) product.setSizes(sizes);
        if (bestseller != null) product.setBestseller(bestseller);
        product.setSalePrice((salePrice != null && salePrice > 0) ? salePrice : null);
        if (color != null) product.setColor(color);
        if (colorGroup != null) product.setColorGroup(colorGroup.isBlank() ? null : colorGroup);
        return productRepository.save(product);
    }

    public void removeProduct(Long id) {
        productRepository.deleteById(id);
    }

    public Product setSalePrice(Long id, Double salePrice) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));
        // salePrice null ou 0 = retirer le solde
        product.setSalePrice((salePrice != null && salePrice > 0) ? salePrice : null);
        return productRepository.save(product);
    }

    private String uploadImage(MultipartFile file) {
        try {
            @SuppressWarnings("rawtypes")
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap("folder", "aura_products")
            );
            return (String) uploadResult.get("secure_url");
        } catch (Exception e) {
            // Fallback: save to local uploads folder
            try {
                String ext = getExtension(file.getOriginalFilename());
                String filename = System.currentTimeMillis() + "_" + (int) (Math.random() * 1_000_000) + ext;
                Path dir = Paths.get(uploadDir);
                Files.createDirectories(dir);
                Files.write(dir.resolve(filename), file.getBytes());
                return "/uploads/" + filename;
            } catch (IOException ioException) {
                return null;
            }
        }
    }

    private String getExtension(String filename) {
        if (filename == null) return "";
        int dot = filename.lastIndexOf('.');
        return dot >= 0 ? filename.substring(dot) : "";
    }
}
