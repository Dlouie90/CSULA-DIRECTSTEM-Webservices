package edu.csula.directstem.results;

import edu.csula.directstem.model.User;

public class CreateUserResult {
    private User user;
    private boolean successful;

    public CreateUserResult(User user, boolean successful) {
        this.user = user;
        this.user.setId(-1);
        this.successful = successful;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public boolean isSuccessFull() {
        return successful;
    }

    public void setSuccessFull(boolean successFull) {
        this.successful = successFull;
    }
}

