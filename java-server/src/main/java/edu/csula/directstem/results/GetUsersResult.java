package edu.csula.directstem.results;

import edu.csula.directstem.model.User;

import java.util.List;

public class GetUsersResult {
    private List<User> users;
    private boolean success;

    public GetUsersResult(List<User> users, boolean success) {
        this.users = users;
        this.success = success;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}
