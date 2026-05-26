package com.smartstudy.smartstudy_backend.service;

import com.google.gson.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    public String generateContent(String prompt) {

        try {
            
            String urlString =
                    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

            URL url = new URL(urlString);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);

            // ⚠️ IMPORTANT: escape quotes
            String safePrompt = prompt.replace("\"", "\\\"");

            String jsonInput = """
            {
              "contents": [
                {
                  "parts": [
                    { "text": "%s" }
                  ]
                }
              ]
            }
            """.formatted(safePrompt);

            // send request
            try (OutputStream os = conn.getOutputStream()) {
                os.write(jsonInput.getBytes());
                os.flush();
            }

            // ❗ check error response also
            BufferedReader br;

            if (conn.getResponseCode() >= 400) {
                br = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
            } else {
                br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            }

            StringBuilder response = new StringBuilder();
            String line;

            while ((line = br.readLine()) != null) {
                response.append(line);
            }

            System.out.println("Gemini RAW RESPONSE: " + response);

            JsonObject json = JsonParser.parseString(response.toString()).getAsJsonObject();

            // ❗ safe parsing (no crash)
            if (!json.has("candidates")) {
                return "❌ Gemini Error: " + response;
            }

            return json
                    .getAsJsonArray("candidates")
                    .get(0)
                    .getAsJsonObject()
                    .getAsJsonObject("content")
                    .getAsJsonArray("parts")
                    .get(0)
                    .getAsJsonObject()
                    .get("text")
                    .getAsString();

        } catch (Exception e) {
            e.printStackTrace();
            return "❌ Exception: " + e.getMessage();
        }
    }
}