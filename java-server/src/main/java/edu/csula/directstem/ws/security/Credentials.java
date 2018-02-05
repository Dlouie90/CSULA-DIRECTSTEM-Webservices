package edu.csula.directstem.ws.security;

import java.io.Serializable;

public class Credentials implements Serializable {
  private String username;
  private String password;
  private String passwordHash;
  
  public String getUsername() {
    return username;
  }
  public void setUsername(String username) {
    this.username = username;
  }
  public String getPassword() {
    return password;
  }
  public void setPassword(String password) {
    this.password = password;
  }
  
  public void getPasswordHash() {
    if (passwordHash == null) {
      passwordHash = BCrypt.hashpw(password, BCrypt.gensalt(12));;
    }
    return passwordHash;
  }

  // Getters and setters omitted
}
