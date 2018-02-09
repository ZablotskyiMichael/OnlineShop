package com.websystique.springboot.service;

import com.websystique.springboot.model.Role;
import com.websystique.springboot.model.User;
import com.websystique.springboot.repositories.RoleRepository;
import com.websystique.springboot.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service("userService")
@Transactional
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RoleRepository roleRepository;

	public User findById(Long id) {
		return userRepository.findOne(id);
	}

	public User findByName(String name) {
		return userRepository.findByName(name);
	}

	public void saveUser(User user) {
		userRepository.save(user);
	}

	public void updateUser(User user){
		saveUser(user);
	}

	public void deleteUserById(Long id){
		userRepository.delete(id);
	}

	public void deleteAllUsers(){
		userRepository.deleteAll();
	}

	public List<User> findAllUsers(){
		return userRepository.findAll();
	}

	public boolean isUserExist(User user) {
		return findByName(user.getName()) != null;
	}

	public User registerNewUserAccount(UserDto accountDto){
		/*if (nameExist(accountDto.getName())) {
			throw new IllegalArgumentException();
		}*/
		User user = new User();
		user.setName(accountDto.getName());
		user.setPassword(accountDto.getPassword());
		user.setEnabled(1);
		if (accountDto.getParent_name()!=null){
			user.setParent_id(userRepository.findByName(accountDto.getParent_name()).getId());
		}
		Role role = roleRepository.findByRoleTitle("ROLE_USER");
		if (role == null){
			role = new Role() ;
			role.setRoleTitle("ROLE_USER");
			roleRepository.save(role);
		}
		user.setRole(role);

		return userRepository.save(user);
	}

	public boolean nameExist(String name) {
		User user = userRepository.findByName(name);
		if (user != null) {
			return true;
		}
		return false;
	}

	@Override
	public void takeMoneyFromAccount(User user, double total_price,int discount) {
		double discountValue = total_price*((Double.valueOf(discount))/100);
		user.setAccount(user.getAccount()-total_price+discountValue);
		userRepository.save(user);
	}

	@Override
	public User getCurrentUser (){
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		String name = auth.getName();
		User user = findByName(name);
		return user;
	}

}
