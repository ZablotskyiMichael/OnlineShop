package com.websystique.springboot.controller;

import com.websystique.springboot.model.User;
import com.websystique.springboot.service.UserDto;
import com.websystique.springboot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class AppController {

	@Autowired
    UserService userService;

	@RequestMapping("/")
	String home(ModelMap modal) {
		modal.addAttribute("title","CRUD Example");
		return "index";
	}

	@RequestMapping("/login")
	String login (ModelMap modal) {
		modal.addAttribute("title","Login");
		return "login";
	}

	@RequestMapping("/partials/{page}")
	String partialHandler(@PathVariable("page") final String page,Model model) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		String name = auth.getName(); //get logged in username

		model.addAttribute("user", userService.findByName(name));
		return page;
	}
	@RequestMapping("/productadmin")
	String adminHandler() {
		return "productadmin";
	}

	@RequestMapping("/administrator/{page}")
	String adminHandler(@PathVariable("page") final String page) {

		return page;
	}

}
