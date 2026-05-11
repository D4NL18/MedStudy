package com.medstudy.backend.core.logging;

import ch.qos.logback.classic.PatternLayout;
import ch.qos.logback.classic.spi.ILoggingEvent;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class MaskingPatternLayout extends PatternLayout {

    private Pattern multilinePattern;
    private final List<String> maskPatterns = new ArrayList<>();

    public void addMaskPattern(String maskPattern) {
        maskPatterns.add(maskPattern);
        multilinePattern = Pattern.compile(
                maskPatterns.stream().collect(Collectors.joining("|")),
                Pattern.MULTILINE | Pattern.CASE_INSENSITIVE
        );
    }

    @Override
    public String doLayout(ILoggingEvent event) {
        return maskMessage(super.doLayout(event));
    }

    private String maskMessage(String message) {
        if (multilinePattern == null || message == null) {
            return message;
        }
        StringBuilder sb = new StringBuilder(message);
        Matcher matcher = multilinePattern.matcher(sb);
        while (matcher.find()) {
            if (matcher.group().contains("=")) {
                // Key-value pair like password=123
                int equalsIdx = matcher.group().indexOf("=");
                String key = matcher.group().substring(0, equalsIdx + 1);
                maskRange(sb, matcher.start() + equalsIdx + 1, matcher.end());
            } else if (matcher.group().contains(":")) {
                // JSON style like "password": "123"
                int colonIdx = matcher.group().indexOf(":");
                maskRange(sb, matcher.start() + colonIdx + 1, matcher.end());
            } else {
                // Direct match
                maskRange(sb, matcher.start(), matcher.end());
            }
        }
        return sb.toString();
    }

    private void maskRange(StringBuilder sb, int start, int end) {
        IntStream.range(start, end).forEach(i -> {
            if (sb.charAt(i) != '\"' && sb.charAt(i) != '\'' && sb.charAt(i) != ',' && sb.charAt(i) != ' ' && sb.charAt(i) != '\n' && sb.charAt(i) != '\r') {
                sb.setCharAt(i, '*');
            }
        });
    }
}
