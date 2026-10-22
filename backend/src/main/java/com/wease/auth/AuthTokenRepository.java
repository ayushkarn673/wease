package com.wease.auth;

import com.wease.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import java.util.Optional;

public interface AuthTokenRepository extends JpaRepository<AuthToken, Long> {

    Optional<AuthToken> findByTokenHashAndType(String tokenHash, AuthTokenType type);

    @Modifying
    void deleteByUserAndType(User user, AuthTokenType type);
}
