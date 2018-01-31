package edu.csula.directstem.results;

import edu.csula.directstem.model.User;

public class UpdateUserResult {
  private int id;
  private User user;
  private boolean successful;

  public UpdateUserResult(int id, User user, boolean successful) {
    this.id = id;
    this.user = user;
    this.successful = successful;
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

  public boolean isSuccessful() {
    return successful;
  }

  public void setSuccessful(boolean successful) {
    this.successful = successful;
  }
}
