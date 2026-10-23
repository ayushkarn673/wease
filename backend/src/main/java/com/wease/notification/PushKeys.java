package com.wease.notification;

import jakarta.persistence.*;
import lombok.*;

// The server's own Web Push (VAPID) key pair, created on first start so nothing has to be configured.
// There is only ever one row. Setting VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY overrides it.
@Entity
@Table(name = "push_keys")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PushKeys {

    public static final long ID = 1L;

    @Id
    private Long id;

    @Column(nullable = false, length = 120)
    private String publicKey;

    @Column(nullable = false, length = 80)
    private String privateKey;
}
