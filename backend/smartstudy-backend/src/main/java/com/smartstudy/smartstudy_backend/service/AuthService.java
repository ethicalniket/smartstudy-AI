package com.smartstudy.smartstudy_backend.service;

import com.smartstudy.smartstudy_backend.dto.UserLoginRequest;
import com.smartstudy.smartstudy_backend.dto.UserRegisterRequest;
import com.smartstudy.smartstudy_backend.entity.User;
import com.smartstudy.smartstudy_backend.repository.UserRepository;
import com.smartstudy.smartstudy_backend.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }
    public String register(UserRegisterRequest request) {

        // 1. email already exists?
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // 2. create user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());

        // 3. encode password
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // 4. save user
        userRepository.save(user);

        // 5. generate jwt
        return jwtUtil.generateToken(user.getEmail());
    }
    public String login(UserLoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // password match?
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return jwtUtil.generateToken(user.getEmail());
    }
}