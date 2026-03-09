package com.backend.projet.dao.util;

import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ClientHttp {

    private final URL url;
    private String method;
    private int statusCode;
    private Map<String, String> headers;
    private String requestBody;
    private String responseBody;
    private String contentType;

    public ClientHttp(String url, String method, String requestBody) throws MalformedURLException {
        this.method = method.toUpperCase();
        this.headers = new HashMap<>();
        this.statusCode = 0;
        this.url = URI.create(url).toURL();
        this.responseBody = requestBody;
    }

    public void setMethod(String method){
        this.method = method;
    }

    public void addHeader(String key, String value){
        this.headers.put(key, value);
    }

    public void setRequestBody(String requestBody){
        this.requestBody = requestBody;
    }

    public String executeRequest() throws IOException {
        HttpURLConnection conn = (HttpURLConnection) this.url.openConnection();
        conn.setRequestMethod(this.method);
        conn.setConnectTimeout(5000);
        conn.setReadTimeout(6000);
        conn.setInstanceFollowRedirects(true);

        for (Map.Entry<String, String> entry : this.headers.entrySet()) {
            conn.setRequestProperty(entry.getKey(), entry.getValue());
        }

        if (this.requestBody != null && !this.requestBody.isEmpty() && !this.method.equals("GET")) {
            conn.setDoOutput(true);
            try (OutputStream os = conn.getOutputStream()) {
                os.write(this.requestBody.getBytes(StandardCharsets.UTF_8));
            }
        }

        this.statusCode = conn.getResponseCode();
        this.contentType = conn.getContentType();

        InputStream stream = (this.statusCode < 400) ? conn.getInputStream() : conn.getErrorStream();

        StringBuilder responseBodyStr = new StringBuilder();
        if (stream != null) {
            try (BufferedReader br = new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8))) {
                String line;
                while ((line = br.readLine()) != null) {
                    responseBodyStr.append(line).append("\n");
                }
            }
        }
        conn.disconnect();
        this.responseBody = responseBodyStr.toString().trim();
        return this.responseBody;
    }

    public int getStatusCode() {
        return this.statusCode;
    }

    public String getContentType() {
        return this.contentType;
    }

    public String getResponseBody() {
        return this.responseBody;
    }
}
