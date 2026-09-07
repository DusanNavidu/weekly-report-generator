package com.sisenco.backend.controller;

import com.sisenco.backend.dto.ApiResponse;
import com.sisenco.backend.dto.ChatRequestDto;
import com.sisenco.backend.dto.ChatResponseDto;
import com.sisenco.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * @author Dusan
 * @date 9/7/2026
 */

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<ChatResponseDto>> askQuestion(@RequestBody ChatRequestDto request) {
        String answer = chatService.askAI(request.getQuestion());
        ChatResponseDto responseDto = new ChatResponseDto(answer);
        return ResponseEntity.ok(new ApiResponse<>(200, "SUCCESS", responseDto));
    }
}
