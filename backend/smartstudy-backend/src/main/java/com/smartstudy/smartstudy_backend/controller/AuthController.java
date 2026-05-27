package com.smartstudy.smartstudy_backend.controller;

import com.smartstudy.smartstudy_backend.entity.User;
import com.smartstudy.smartstudy_backend.repository.UserRepository;
import com.smartstudy.smartstudy_backend.service.UserService;
import com.smartstudy.smartstudy_backend.util.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    // =========================
    // DEPENDENCIES
    // =========================

    private final UserService userService;

    private final PasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil;

    private final UserRepository userRepository;

    // =========================
    // CONSTRUCTOR
    // =========================

    public AuthController(

            UserService userService,

            PasswordEncoder passwordEncoder,

            JwtUtil jwtUtil,

            UserRepository userRepository

    ) {

        this.userService = userService;

        this.passwordEncoder = passwordEncoder;

        this.jwtUtil = jwtUtil;

        this.userRepository = userRepository;

    }

    // =========================
    // REGISTER
    // =========================

    @PostMapping("/register")

    public ResponseEntity<?> register(

            @RequestBody Map<String, String> body

    ) {

        String name =
                body.get("name");

        String email =
                body.get("email");

        String password =
                body.get("password");

        if (

                name == null ||

                        email == null ||

                        password == null

        ) {

            return ResponseEntity
                    .badRequest()
                    .body(

                            Map.of(

                                    "error",

                                    "name, email and password required"

                            )

                    );

        }

        if (

                userService
                        .findByEmail(email)
                        .isPresent()

        ) {

            return ResponseEntity
                    .badRequest()
                    .body(

                            Map.of(

                                    "error",

                                    "email already exists"

                            )

                    );

        }

        User user = new User();

        user.setName(name);

        user.setEmail(email);

        user.setPassword(password);

        userService.create(user);

        return ResponseEntity.ok(

                Map.of(

                        "message",

                        "User registered successfully"

                )

        );

    }

    // =========================
    // LOGIN
    // =========================

    @PostMapping("/login")

    public ResponseEntity<?> login(

            @RequestBody Map<String, String> body

    ) {

        String email =
                body.get("email");

        String password =
                body.get("password");

        User user =

                userService
                        .findByEmail(email)
                        .orElse(null);

        if (

                user == null ||

                        !passwordEncoder.matches(
                                password,
                                user.getPassword()
                        )

        ) {

            return ResponseEntity
                    .status(401)
                    .body(

                            Map.of(

                                    "error",

                                    "Invalid credentials"

                            )

                    );

        }

        System.out.println(
                "JWT NAME => " +
                        user.getName()
        );

        String token =

                jwtUtil.generateToken(
                        user.getEmail()
                );

        return ResponseEntity.ok(

                Map.of(

                        "token",
                        token,

                        "type",
                        "Bearer",

                        "name",
                        user.getName()

                )

        );
    }

    // =========================
    // UPDATE PROFILE
    // =========================

    @PutMapping("/profile")

    public ResponseEntity<?> updateProfile(

            @RequestBody User updatedUser,

            HttpServletRequest request

    ) {

        try {

            String authHeader =

                    request.getHeader(
                            "Authorization"
                    );

            String token =
                    authHeader.substring(7);

            String email =

                    jwtUtil.extractSubject(
                            token
                    );

            User user =

                    userRepository
                            .findByEmail(email)
                            .orElseThrow(

                                    () ->

                                            new RuntimeException(
                                                    "User not found"
                                            )

                            );

            user.setName(
                    updatedUser.getName()
            );

            user.setBio(
                    updatedUser.getBio()
            );

            userRepository.save(user);

            return ResponseEntity.ok(

                    Map.of(

                            "message",

                            "Profile updated"

                    )

            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(500)
                    .body(
                            "Profile update failed"
                    );

        }

    }

    // =========================
    // GET PROFILE
    // =========================

    @GetMapping("/profile")

    public ResponseEntity<?> getProfile(

            HttpServletRequest request

    ) {

        try {

            String authHeader =

                    request.getHeader(
                            "Authorization"
                    );

            String token =
                    authHeader.substring(7);

            String email =

                    jwtUtil.extractSubject(
                            token
                    );

            User user =

                    userRepository
                            .findByEmail(email)
                            .orElseThrow(

                                    () ->

                                            new RuntimeException(
                                                    "User not found"
                                            )

                            );

            return ResponseEntity.ok(

                    Map.of(

                            "name",
                            user.getName(),

                            "email",
                            user.getEmail(),

                            "bio",
                            user.getBio()

                    )

            );

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(500)
                    .body(
                            "Failed to fetch profile"
                    );

        }

    }

}