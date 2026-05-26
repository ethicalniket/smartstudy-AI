package com.smartstudy.smartstudy_backend.util;

import com.smartstudy.smartstudy_backend.dto.UserResponseDTO;
import com.smartstudy.smartstudy_backend.entity.User;

public class UserMapper {
    public static UserResponseDTO toDto(User u) {
        if (u == null) return null;
        return new UserResponseDTO(u.getId(), u.getName(), u.getEmail(), u.getCreatedAt());
    }
}