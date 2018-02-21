package edu.csula.directstem.results.project;

public class DeleteProjectByIdResult {
    private int id;
    private boolean successful;

    public DeleteProjectByIdResult(int id, boolean successful) {
        this.id = id;
        this.successful = successful;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public boolean isSuccessful() {
        return successful;
    }

    public void setSuccessful(boolean successful) {
        this.successful = successful;
    }
}
