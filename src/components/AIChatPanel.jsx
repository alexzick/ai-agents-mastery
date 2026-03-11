import { useState, useEffect, useRef } from "react";
import MarkdownText from "./MarkdownText";

/**
 * Floating AI Study Buddy chat panel.
 * Appears on study screens (Browse, Curriculum, Study Flow).
 * Context-aware: knows what topic the user is reading.
 * Multi-turn conversation that resets when the topic changes.
 */
export default function AIChatPanel({ topic, contextLabel }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastTopicId, setLastTopicId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Reset conversation when topic changes
  useEffect(() => {
    if (topic?.id && topic.id !== lastTopicId) {
      setMessages([]);
      setLastTopicId(topic.id);
    }
  }, [topic?.id, lastTopicId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const buildSystemPrompt = () => {
    if (!topic) {
      return "You are a helpful AI study buddy for someone learning about AI agents and building agentic systems. Be concise but thorough. Use examples and analogies when helpful. Keep responses under 150 words unless asked for more detail.";
    }
    return `You are an AI study buddy helping a student master AI agent concepts. The student is currently studying:

Topic: "${topic.title}"
Category: ${topic.category}
Core concept: ${topic.core}

Help them understand this topic deeply. Be conversational, concise, and Socratic — ask follow-up questions to probe understanding when appropriate. Use analogies and examples. If they ask you to quiz them, generate questions that test genuine understanding, not just memorization. Keep responses under 150 words unless they ask for detail.`;
  };

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const apiKey = localStorage.getItem("anthropic-api-key");
    if (!apiKey) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "⚙️ Please set your Anthropic API key in **Settings** (home screen gear icon) to use the chat.",
        },
      ]);
      return;
    }

    const userMsg = { role: "user", content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          system: buildSystemPrompt(),
          apiKey,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠️ Error: ${err.message}` },
      ]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const quickPrompts = topic
    ? [
        {
          label: "Quiz me",
          text: `Quiz me on "${topic.title}" — ask me a question that tests real understanding, not just memorization.`,
        },
        {
          label: "Explain simpler",
          text: `Can you explain "${topic.title}" in simpler terms? Use an everyday analogy.`,
        },
        {
          label: "Why does this matter?",
          text: `Why does "${topic.title}" matter when building AI agents? Give me a concrete scenario.`,
        },
        {
          label: "Common mistakes",
          text: `What are common mistakes or misconceptions about "${topic.title}"?`,
        },
        {
          label: "Connect the dots",
          text: `How does "${topic.title}" connect to other AI agent concepts?`,
        },
      ]
    : [
        {
          label: "What should I study?",
          text: "What topic should I study first if I'm learning about AI agents from scratch?",
        },
        {
          label: "Explain agents",
          text: "What is an AI agent and how is it different from a chatbot?",
        },
        {
          label: "Learning strategy",
          text: "What's the most effective way to learn about AI agents?",
        },
      ];

  const isMobile =
    typeof window !== "undefined" && window.innerWidth < 480;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: isOpen ? "#1e293b" : "#64ffda22",
          border: `2px solid ${isOpen ? "#475569" : "#64ffda"}`,
          color: isOpen ? "#94a3b8" : "#64ffda",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          zIndex: 1000,
          transition: "all 0.2s",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        }}
        title="AI Study Buddy"
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {/* Chat Panel */}
      <div
        style={{
          position: "fixed",
          bottom: 88,
          right: isMobile ? 16 : 24,
          left: isMobile ? 16 : "auto",
          width: isMobile ? "auto" : 400,
          maxHeight: "60vh",
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: 16,
          display: "flex",
          flexDirection: "column",
          zIndex: 999,
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          transition: "all 0.25s ease",
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "translateY(0)" : "translateY(20px)",
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid #1e293b",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#64ffda",
                letterSpacing: 2,
                textTransform: "uppercase",
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
              }}
            >
              AI STUDY BUDDY
            </div>
            {topic && (
              <div
                style={{
                  fontSize: 12,
                  color: "#64748b",
                  marginTop: 2,
                  maxWidth: 220,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {topic.title}
              </div>
            )}
          </div>
          {contextLabel && (
            <div
              style={{
                fontSize: 10,
                color: "#a78bfa",
                padding: "3px 10px",
                border: "1px solid #a78bfa33",
                borderRadius: 100,
                fontFamily: "'Space Mono', monospace",
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              {contextLabel}
            </div>
          )}
        </div>

        {/* Messages Area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            minHeight: 200,
            maxHeight: "calc(60vh - 130px)",
          }}
        >
          {/* Quick prompts when empty */}
          {messages.length === 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
                padding: "20px 0",
              }}
            >
              <div
                style={{
                  fontSize: 32,
                  opacity: 0.6,
                }}
              >
                🧠
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#64748b",
                  textAlign: "center",
                  lineHeight: 1.6,
                }}
              >
                {topic
                  ? `Ask me anything about "${topic.title}" or pick a prompt below`
                  : "Ask me anything about AI agents"}
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  justifyContent: "center",
                  maxWidth: "100%",
                }}
              >
                {quickPrompts.map((qp) => (
                  <button
                    key={qp.label}
                    onClick={() => sendMessage(qp.text)}
                    disabled={loading}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 100,
                      border: "1px solid #64ffda33",
                      background: "#64ffda08",
                      color: "#64ffda",
                      cursor: loading ? "not-allowed" : "pointer",
                      fontSize: 11,
                      fontWeight: 500,
                      fontFamily: "inherit",
                      transition: "all 0.15s",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#64ffda18")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#64ffda08")
                    }
                  >
                    {qp.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message bubbles */}
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                alignSelf:
                  msg.role === "user" ? "flex-end" : "flex-start",
                background:
                  msg.role === "user" ? "#64ffda11" : "#1e293b44",
                border: `1px solid ${
                  msg.role === "user" ? "#64ffda22" : "#1e293b"
                }`,
                borderRadius:
                  msg.role === "user"
                    ? "16px 16px 4px 16px"
                    : "16px 16px 16px 4px",
                padding: "10px 14px",
                maxWidth: "85%",
                fontSize: 13,
                color: msg.role === "user" ? "#e2e8f0" : "#94a3b8",
                lineHeight: 1.6,
              }}
            >
              {msg.role === "assistant" ? (
                <MarkdownText
                  text={msg.content}
                  style={{ fontSize: 13, lineHeight: 1.6 }}
                />
              ) : (
                msg.content
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div
              style={{
                alignSelf: "flex-start",
                background: "#1e293b44",
                border: "1px solid #1e293b",
                borderRadius: "16px 16px 16px 4px",
                padding: "10px 14px",
                fontSize: 13,
                color: "#475569",
              }}
            >
              <span style={{ animation: "pulse-border 1.5s infinite" }}>
                Thinking...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid #1e293b",
            display: "flex",
            gap: 8,
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              topic ? "Ask about this topic..." : "Ask anything..."
            }
            disabled={loading}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid #1e293b",
              background: "#0d1117",
              color: "#e2e8f0",
              fontSize: 13,
              fontFamily: "inherit",
              outline: "none",
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "1px solid #64ffda33",
              background:
                input.trim() && !loading ? "#64ffda22" : "#0d1117",
              color: input.trim() && !loading ? "#64ffda" : "#334155",
              cursor:
                loading || !input.trim() ? "not-allowed" : "pointer",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
              flexShrink: 0,
            }}
          >
            ↑
          </button>
        </div>
      </div>
    </>
  );
}
