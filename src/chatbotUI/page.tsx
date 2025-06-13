import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Avatar,
  TextField,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

// Message type definition
type Message = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
};

// Fixed bot responses - replace with your backend integration later
const botResponses = [
  "Hello! How can I help you today?",
  "That's interesting! Tell me more.",
  "I understand your question. Let me think about that.",
  "I'm just a demo bot for now. Soon I'll be connected to a real backend!",
  "That's a great point you're making.",
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-message",
      content: "Hello! How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate bot response with slight delay
    setTimeout(() => {
      const randomResponse =
        botResponses[Math.floor(Math.random() * botResponses.length)];
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        content: randomResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
      p={2}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 400,
          height: 600,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardHeader
          avatar={<Avatar sx={{ bgcolor: "primary.main" }}>B</Avatar>}
          title="Chatbot"
        />
        <Divider />
        <CardContent sx={{ flex: 1, overflowY: "auto", p: 2 }}>
          <Stack spacing={2}>
            {messages.map((message) => (
              <Box
                key={message.id}
                display="flex"
                justifyContent={
                  message.sender === "user" ? "flex-end" : "flex-start"
                }
              >
                <Box
                  sx={{
                    bgcolor:
                      message.sender === "user" ? "primary.main" : "grey.200",
                    color:
                      message.sender === "user"
                        ? "primary.contrastText"
                        : "text.primary",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    maxWidth: "80%",
                  }}
                >
                  <Typography variant="body2">{message.content}</Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ p: 2 }}>
          <Box
            component="form"
            onSubmit={handleSendMessage}
            display="flex"
            width="100%"
            gap={1}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleSendMessage(e as any);
                }
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ minWidth: 0, px: 2 }}
            >
              <SendIcon />
            </Button>
          </Box>
        </CardActions>
      </Card>
    </Box>
  );
}
