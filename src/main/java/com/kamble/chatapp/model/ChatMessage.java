package com.kamble.chatapp.model;

import com.kamble.chatapp.MessageType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ChatMessage {
    private String sender;
    private String content;
    private MessageType messageType;
}

