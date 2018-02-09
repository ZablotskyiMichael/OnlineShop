package com.websystique.springboot.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import javax.sql.DataSource;

@Configuration
//@EnableAutoConfiguration
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Qualifier("dataSource")
    @Autowired
    DataSource dataSource;

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {

        auth.inMemoryAuthentication()
                /*.withUser("user").password("password").roles("USER")
                .and()*/
                .withUser("admin").password("password").roles("ADMIN");
    }

    @Autowired
    public void configAuthentication(AuthenticationManagerBuilder auth) throws Exception {
        /*auth.jdbcAuthentication().dataSource(dataSource)
                .usersByUsernameQuery("select name as username,password, enabled from APP_USER where name=?")
                .authoritiesByUsernameQuery("SELECT APP_USER.name as username, APP_ROLE.name as role FROM APP_USER \n" +
                        "INNER JOIN user_role ON APP_USER.id = user_role.user_id\n" +
                        " INNER JOIN APP_ROLE ON user_role.role_id = APP_ROLE.role_id WHERE APP_USER.name = ?");*/
        auth.jdbcAuthentication().dataSource(dataSource)
                .usersByUsernameQuery("select name as username, password, enabled from APP_USER where name=?")
                .authoritiesByUsernameQuery("select app_user.NAME as username,  app_role.roleTitle from app_user \n" +
                        " join app_role on app_user.role_id=app_role.ROLE_ID where app_user.name =?");
    }

    /*@Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
                .antMatchers( "/","/api/**").permitAll()
                .antMatchers("/api/user/**").hasAuthority("ADMIN")
                .antMatchers("/api/role/**").hasAuthority("ADMIN")
                .anyRequest().authenticated()
                .and()
                .formLogin().loginPage("/login").permitAll()
                .defaultSuccessUrl("/#/")
                .and().logout()
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                .logoutSuccessUrl("/").and().exceptionHandling();
        http.exceptionHandling().accessDeniedPage("/error");
    }*/
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()
                .antMatchers("/registration/**","/#/registration/**","/user/registration").permitAll()

                .antMatchers("/#/administrator/**","/administrator/**").hasRole("ADMIN")
                .antMatchers("/admin/**","/product/**","/partials/storage","/partials/category","partials/properties","/#/storage").hasAnyRole("ADMIN")
                .antMatchers("/partials/**").hasAnyRole("ADMIN","USER")
                .antMatchers("/user/**","/storage/**").hasAnyRole("ADMIN","USER")
                .anyRequest().authenticated()
                .and()
                .formLogin().loginPage("/login").permitAll()
                .defaultSuccessUrl("/#/user")
                .and()
                .httpBasic()
                .and().csrf().disable()
               // .formLogin().disable()
                .logout()
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                .logoutSuccessUrl("/").and().exceptionHandling().accessDeniedPage("/secError");
        http.exceptionHandling().accessDeniedPage("/secError");
    }

}
