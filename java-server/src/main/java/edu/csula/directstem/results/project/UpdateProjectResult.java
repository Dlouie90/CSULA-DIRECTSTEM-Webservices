package edu.csula.directstem.results.project;

import edu.csula.directstem.model.Project;

public class UpdateProjectResult {
    private int id;
    private Project project;
    private boolean successful;

    public UpdateProjectResult(int id, Project project, boolean successful) {
        this.id = id;
        this.project = project;
        this.successful = successful;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public boolean isSuccessful() {
        return successful;
    }

    public void setSuccessful(boolean successful) {
        this.successful = successful;
    }
}
