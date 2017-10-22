package edu.csula.directstem.results;

import edu.csula.directstem.model.User;

public class LoginUserResult {
    private String email;
    private String password;
    private User user;
    private boolean successful;


    public LoginUserResult(String email, String password, User user) {
        this.email = email;
        this.password = password;
        this.user = user;
        this.successful = user != null;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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
