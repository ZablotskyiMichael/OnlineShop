package com.websystique.springboot.service;

import com.websystique.springboot.model.Role;

import java.util.List;

public interface RoleService {
    Role findById(Long id);

    Role findByName(String name);

    void saveRole(Role role);

    void updateRole(Role role);

    void deleteRoleById(Long id);

    void deleteAllRoles();

    List<Role> findAllRoles();

    boolean isRoleExist(Role role);
}