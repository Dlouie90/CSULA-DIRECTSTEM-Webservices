package edu.csula.directstem.ws.security;

import java.io.Serializable;

public class CredentialsWithToken extends Credentials {
  private String token;
  private String validUntil;
  public String getToken() {
    return token;
  }
  public void setToken(String token) {
    this.token = token;
  }
  public String getValidUntil() {
    return validUntil;
  }
  public void setValidUntil(String validUntil) {
    this.validUntil = validUntil;
  }

  // Getters and setters omitted
}
