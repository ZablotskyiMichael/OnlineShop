package com.websystique.springboot.model;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
@Entity
@Table(name = "APP_ROLE")
@EntityListeners(AuditingEntityListener.class)
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name = "ROLE_ID")
    private Long role_Id;

    @Column(name = "roleTitle")
    private String roleTitle;

    public Long getRoleId() {
        return role_Id;
    }

    public void setRoleId(Long roleId) {
        this.role_Id = roleId;
    }

    public String getRoleTitle() { return roleTitle; }

    public void setRoleTitle(String roleTitle) {
        this.roleTitle = roleTitle;
    }
}
