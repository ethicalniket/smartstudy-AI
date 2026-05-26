package com.smartstudy.smartstudy_backend.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expirationMs}")
    private long jwtExpirationMs;

    private Algorithm algorithm() {
        return Algorithm.HMAC256(jwtSecret);
    }

    public String generateToken(String subject) {
        Date now = new Date();
        Date expiresAt = new Date(now.getTime() + jwtExpirationMs);

        return JWT.create()
                .withSubject(subject)
                .withIssuedAt(now)
                .withExpiresAt(expiresAt)
                .sign(algorithm());
    }

    public String extractSubject(String token) {
        try {
            DecodedJWT jwt = JWT.require(algorithm()).build().verify(token);
            return jwt.getSubject();
        } catch (JWTVerificationException ex) {
            return null;
        }
    }

    public boolean validateToken(String token) {
        try {
            JWT.require(algorithm()).build().verify(token);
            return true;
        } catch (JWTVerificationException ex) {
            return false;
        }
    }
}