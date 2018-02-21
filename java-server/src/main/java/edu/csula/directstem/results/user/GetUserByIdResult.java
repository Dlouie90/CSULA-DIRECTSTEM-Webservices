package edu.csula.directstem.results.user;

import edu.csula.directstem.model.User;

public class GetUserByIdResult {
  private int id;
  private User user;
  private boolean success;

  public GetUserByIdResult(int id, User user) {
    this.id = id;
    this.user = user;
    this.success = user != null;
  }

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public User getUser() {
    return user;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public boolean isSuccess() {
    return success;
  }

  public void setSuccess(boolean success) {
    this.success = success;
  }
}
