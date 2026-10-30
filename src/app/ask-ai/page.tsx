"use client";

import Layout from "@/components/Layout";
import { useState, useEffect, useRef } from "react";
import { fetchFromAPI } from "@/services/api";
import { Bot, Send, User, Sparkles, BrainCircuit, AlertCircle } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AskAIPage() {
  const [profile, setProfile] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I am your NextRole AI Career Coach. I have analyzed your profile. Ask me anything about skill gaps, interview prep, or how to reach your career targets!"
    }
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const result = await fetchFromAPI("/profile");
        setProfile(result.data);
      } catch (err: any) {
        setError("Please upload your resume in the Resume tab to initialize your profile details before consulting the AI Coach.");
      }
    }
    loadProfile();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsSending(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
      if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY") {
        // Fallback simulation if Gemini Key is not configured on frontend
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              role: "assistant",
              content: `Based on your question about "${userMessage}": ${profile ? `Given your skills in ${profile.skills?.slice(0,5).join(", ") || "software engineering"} and your target role of ${profile.targetRole || "Cloud Architect"}, I recommend focusing on AWS serverless architecture, building projects with Lambda and DynamoDB, and preparing for the AWS Solutions Architect Associate exam.` : `I recommend focusing on cloud computing fundamentals, building real-world projects, and pursuing AWS certifications to strengthen your career profile. Upload your resume for personalized advice!`}`
            }
          ]);
          setIsSending(false);
        }, 1200);
        return;
      }

      // Initialize Gemini Client
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const contextPrompt = `
You are the NextRole AI Career Advisor.
User Profile Details:
- Name: ${profile?.name || "User"}
- Target Role: ${profile?.targetRole || "Software Engineer"}
- Summary: ${profile?.summary || ""}
- Skills: ${JSON.stringify(profile?.skills || [])}
- Experience: ${JSON.stringify(profile?.experience || [])}

Provide detailed, premium, professional career advice based on their credentials. Keep formatting clean.

User Question: ${userMessage}
`;

      const result = await model.generateContent(contextPrompt);
      const responseText = result.response.text();

      setMessages(prev => [...prev, { role: "assistant", content: responseText }]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I had trouble processing that question. Ensure your NEXT_PUBLIC_GEMINI_API_KEY is configured in your local environment."
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col h-[78vh] rounded-2xl border border-[#1f2833]/40 bg-[#0f111a] overflow-hidden shadow-2xl">
        {/* Chat Header */}
        <div className="p-4 border-b border-[#1f2833]/15 bg-[#0b0c13]/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                AI Career Advisor
                <Sparkles className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
              </h2>
              <span className="text-[10px] text-gray-500 font-bold block">Powered by Google Gemini API</span>
            </div>
          </div>
        </div>

        {/* Chat History Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin bg-[#08090f]/20">
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-950/10 p-4 text-xs text-amber-300 max-w-2xl mx-auto">
              <AlertCircle className="h-4.5 w-4.5 text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{error} You can still chat, but responses will be generic without your profile context.</p>
            </div>
          )}

          {messages.map((msg, index) => {
            const isUser = msg.role === "user";
            return (
              <div 
                key={index} 
                className={`flex gap-3.5 max-w-3xl ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                {/* Avatar */}
                <div className={`h-8 w-8 shrink-0 rounded-lg flex items-center justify-center border font-bold text-xs ${
                  isUser 
                    ? "bg-blue-600 border-blue-500/30 text-white" 
                    : "bg-[#0b0c13]/80 border-[#1f2833]/30 text-blue-400"
                }`}>
                  {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                {/* Bubble */}
                <div className={`rounded-2xl p-4 text-xs md:text-sm leading-relaxed ${
                  isUser 
                    ? "bg-blue-600/15 text-blue-100 border border-blue-500/20 rounded-tr-none" 
                    : "bg-[#0b0c13]/50 text-[#c5c6c7]/90 border border-[#1f2833]/25 rounded-tl-none"
                }`}>
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex gap-3.5 max-w-xl">
              <div className="h-8 w-8 shrink-0 rounded-lg flex items-center justify-center bg-[#0b0c13]/80 border border-[#1f2833]/30 text-blue-400">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-[#0b0c13]/50 text-gray-500 border border-[#1f2833]/25 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 animate-spin text-blue-400" />
                <span className="text-xs font-semibold">Consulting career models...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-[#1f2833]/15 bg-[#0b0c13]/60 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI Career Coach anything (e.g. How to prepare for AWS Solutions Architect Associate?)"
            className="flex-1 bg-[#07080d] border border-[#1f2833]/40 focus:border-blue-500/50 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-gray-600 focus:outline-none transition duration-150"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </Layout>
  );
}
