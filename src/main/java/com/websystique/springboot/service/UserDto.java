package com.websystique.springboot.service;

import com.sun.istack.internal.NotNull;
import com.websystique.springboot.model.Role;
import org.hibernate.validator.constraints.NotEmpty;

public class UserDto {
    private Long id ;

    @NotNull
    @NotEmpty
    private String name;

    private String parent_name;

    @NotNull
    @NotEmpty
    private Integer password;

     private String roleTitle;

    public String getParent_name() {
        return parent_name;
    }

    public void setParent_name(String parent_name) {
        this.parent_name = parent_name;
    }

    public String getRoleTitle() {
        return roleTitle;
    }

    public void setRoleTitle(String roleTitle) {
        this.roleTitle = roleTitle;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getPassword() {
        return password;
    }

    public void setPassword(Integer password) {
        this.password = password;
    }
}
