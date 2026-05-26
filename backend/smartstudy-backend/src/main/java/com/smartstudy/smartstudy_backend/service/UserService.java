//package com.smartstudy.smartstudy_backend.service;
//
//import com.smartstudy.smartstudy_backend.entity.User;
//import com.smartstudy.smartstudy_backend.repository.UserRepository;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.Optional;
package com.smartstudy.smartstudy_backend.service;

import com.smartstudy.smartstudy_backend.entity.User;
import com.smartstudy.smartstudy_backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;   // <-- add this
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
@Service
public class UserService {
    private final UserRepository repo;
    private final PasswordEncoder encoder;

    public UserService(UserRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

public User create(User user) {

    if (repo.findByEmail(user.getEmail()).isPresent()) {
        throw new IllegalArgumentException("Email already exists");
    }

    // hash password
    user.setPassword(encoder.encode(user.getPassword()));

    return repo.save(user);
}

    public List<User> listAll() {
        return repo.findAll();
    }
    public Optional<User> findByEmail(String email) {
        return repo.findByEmail(email);
    }

    public Optional<User> get(Long id) {
        return repo.findById(id);
    }

    public User update(Long id, User updated) {
        return repo.findById(id).map(u -> {
            u.setName(updated.getName());
            u.setEmail(updated.getEmail());
            // don't update password here for simplicity; update if provided
            if (updated.getPassword() != null && !updated.getPassword().isBlank()) {
                u.setPassword(updated.getPassword());
            }
            return repo.save(u);
        }).orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}