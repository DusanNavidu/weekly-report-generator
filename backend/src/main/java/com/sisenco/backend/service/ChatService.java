package com.sisenco.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sisenco.backend.model.Report;
import com.sisenco.backend.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author Dusan
 * @date 9/7/2026
 */

@Service
@RequiredArgsConstructor
public class ChatService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final ReportRepository reportRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String askAI(String managerQuestion) {

        if(apiKey == null || apiKey.isEmpty() || apiKey.equals("YOUR_API_KEY")) {
            return "⚠️ Error: Please replace 'YOUR_API_KEY' with your real Google Gemini API Key in the application.properties file and RESTART the backend.";
        }

        List<Report> recentReports = reportRepository.findAll();
        StringBuilder contextData = new StringBuilder("Here is the recent team activity data based on the submitted weekly reports:\n");

        for (Report r : recentReports) {
            contextData.append("- Report Status: ").append(r.getStatus()).append("\n");
            if (r.getBlockers() != null && !r.getBlockers().isEmpty()) {
                contextData.append("  Blockers: ");
                r.getBlockers().forEach(b -> contextData.append(b.getDescription()).append(", "));
                contextData.append("\n");
            }
            if (r.getAchievements() != null && !r.getAchievements().isEmpty()) {
                contextData.append("  Achievements: ");
                r.getAchievements().forEach(a -> contextData.append(a.getDescription()).append(", "));
                contextData.append("\n");
            }
            contextData.append("\n");
        }

        String fullPrompt = "You are a helpful and intelligent AI assistant for a project manager. " +
                "Analyze the following team report data and answer the manager's question concisely. " +
                "IMPORTANT: The manager might ask questions in Singlish (Sinhala written in English letters, e.g., 'kohomada den progress eka'). " +
                "You must understand the Singlish question and strictly answer in English based on the context data below.\n\n" +
                "Context Data:\n" + contextData.toString() +
                "\nManager's Question: " + managerQuestion;

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> parts = new HashMap<>();
        parts.put("text", fullPrompt);
        Map<String, Object> contents = new HashMap<>();
        contents.put("parts", List.of(parts));
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(contents));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            JsonNode rootNode = objectMapper.readTree(response.getBody());

            JsonNode textNode = rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text");
            if(textNode.isMissingNode()) {
                return "⚠️ The AI responded, but couldn't process the text (Possible safety block).";
            }
            return textNode.asText();

        } catch (HttpStatusCodeException e) {
            System.err.println("API Error Response: " + e.getResponseBodyAsString());
            return "⚠️ API Error: Invalid Key or Network Issue. Please check the backend console.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Sorry, I encountered an error while analyzing the data. Check the Spring Boot console for details.";
        }
    }
}