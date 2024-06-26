package edu.ucsb.cs156.example.config;

import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.authority.mapping.GrantedAuthoritiesMapper;
import org.springframework.security.oauth2.core.user.OAuth2UserAuthority;
import org.springframework.security.web.authentication.Http403ForbiddenEntryPoint;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;



import edu.ucsb.cs156.example.entities.User;
import edu.ucsb.cs156.example.repositories.UserRepository;
import lombok.extern.slf4j.Slf4j;

/**
 * The `SecurityConfig` class in Java configures web security with OAuth2 login, CSRF protection, and
 * role-based authorization based on user email addresses.
 */
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
@Slf4j
public class SecurityConfig extends WebSecurityConfigurerAdapter {

  @Value("${app.admin.emails}")
  private final List<String> adminEmails = new ArrayList<String>();

  @Autowired
  UserRepository userRepository;

  /**
   * The `configure` method in this Java code configures various security settings for an HTTP request,
   * including authorization, exception handling, OAuth2 login, CSRF protection, and logout behavior.
   * 
   * @param http injected HttpSecurity object (injected by Spring framework)
   */
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.authorizeRequests(authorize -> authorize
        .anyRequest().permitAll())
        .exceptionHandling(handlingConfigurer -> handlingConfigurer
            .authenticationEntryPoint(new Http403ForbiddenEntryPoint()))
        .oauth2Login(
            oauth2 -> oauth2.userInfoEndpoint(userInfo -> userInfo.userAuthoritiesMapper(this.userAuthoritiesMapper())))
        .csrf(csrf -> csrf
            .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()))
        .logout(logout -> logout
            .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
            .logoutSuccessUrl("/"));
  }

  /**
   * The `configure` method is used to configure web security in Java, specifically ignoring requests
   * to the "/h2-console/**" path.
   * 
   * @param web injected by Spring Framework
   */
  @Override
  public void configure(WebSecurity web) throws Exception {
    web.ignoring().antMatchers("/h2-console/**");
  }

  private GrantedAuthoritiesMapper userAuthoritiesMapper() {
    return (authorities) -> {
      Set<GrantedAuthority> mappedAuthorities = new HashSet<>();
      log.info("********** authorities={}", authorities);

      authorities.forEach(authority -> {
        log.info("********** authority={}", authority);
        mappedAuthorities.add(authority);
        if (OAuth2UserAuthority.class.isInstance(authority)) {
          OAuth2UserAuthority oauth2UserAuthority = (OAuth2UserAuthority) authority;

          Map<String, Object> userAttributes = oauth2UserAuthority.getAttributes();
          log.info("********** userAttributes={}", userAttributes);

          String email = (String) userAttributes.get("email");
          if (getAdmin(email)) {
            mappedAuthorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
          }

          if (email.endsWith("@ucsb.edu")) {
            mappedAuthorities.add(new SimpleGrantedAuthority("ROLE_MEMBER"));
          }
        }

      });
      log.info("********** mappedAuthorities={}", mappedAuthorities);
      return mappedAuthorities;
    };
  }

  /**
   * This method checks if the given email belongs to an admin user either from a predefined
   * list or by querying the user repository.
   * 
   * @param email email address of the user
   * @return whether the user with the given email is an admin
   */
  public boolean getAdmin(String email) {
    if (adminEmails.contains(email)) {
      return true;
    }
    Optional<User> u = userRepository.findByEmail(email);
    return u.isPresent() && u.get().getAdmin();
  }
}