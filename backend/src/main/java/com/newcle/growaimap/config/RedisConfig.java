package com.newcle.growaimap.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;

/**
 * Redis 설정
 * 개발 환경에서는 Redis 없이 실행 가능
 */
@Configuration
@ConditionalOnProperty(name = "spring.data.redis.enabled", havingValue = "true", matchIfMissing = false)
public class RedisConfig {
    // Redis가 활성화된 경우에만 설정 로드
}
