
package com.banking.userservice.service;

import com.banking.userservice.kafka.UserRegisteredEvent;
import com.banking.userservice.kafka.UserRegisteredEventProducer;
import com.banking.userservice.model.User;
import com.banking.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

//    // Create new user (hash password before saving)
//    public User createUser(User user) {
//        user.setPassword(passwordEncoder.encode(user.getPassword())); // 🔑 hash password
//        return userRepository.save(user);
//    }

    @Autowired
    private UserRegisteredEventProducer eventProducer;

    public User createUser(User user) {
        // 1️⃣ Hash the password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 2️⃣ Save the user
        User savedUser = userRepository.save(user);

        // 3️⃣ Send Kafka event to notify other services
        UserRegisteredEvent event = new UserRegisteredEvent(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail()
        );
        eventProducer.sendUserRegisteredEvent(event);

        // 4️⃣ Return the saved user
        return savedUser;
    }


    // Login (check email + raw password vs hashed one)
    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email " + email));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password!");
        }
        return user;
    }

    public User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(Long id, User updatedUser) {
        User existingUser = getUser(id);
        existingUser.setName(updatedUser.getName());
        existingUser.setEmail(updatedUser.getEmail());

        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword())); // rehash if updated
        }

        existingUser.setRole(updatedUser.getRole());
        return userRepository.save(existingUser);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id " + id);
        }
        userRepository.deleteById(id);
    }

    public String getUserEmailById(Long id) {
        return userRepository.findById(id)
                .map(User::getEmail)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
}
