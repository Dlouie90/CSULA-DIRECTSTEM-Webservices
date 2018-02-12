package edu.csula.directstem.model;

import org.mindrot.jbcrypt.BCrypt;

public class User {
  private int id;
  private String firstName;
  private String lastName;
  private String email;
  private String username;
  private String passwordHash;


  public User(int id, String firstName, String lastName,
      String email, String username, String passwordHash) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.passwordHash = passwordHash;
    this.username = username;
  }
  
  public void setPassword(String password) {
    this.passwordHash = BCrypt.hashpw(password, BCrypt.gensalt(12));
  }
  
  public boolean isPasswordValid(String password) {
    return BCrypt.checkpw(password, this.passwordHash);
  }

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPasswordHash() {
    return passwordHash;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }
}
