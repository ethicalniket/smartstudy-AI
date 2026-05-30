package com.smartstudy.smartstudy_backend.repository;

import com.smartstudy.smartstudy_backend.entity.ChatConversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatConversationRepository
        extends JpaRepository<ChatConversation, Long> {

    List<ChatConversation>
    findByUserEmailOrderByCreatedAtDesc(
            String userEmail
    );

}