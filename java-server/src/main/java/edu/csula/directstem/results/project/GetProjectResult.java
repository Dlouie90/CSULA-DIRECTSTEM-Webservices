package edu.csula.directstem.results.project;

import edu.csula.directstem.model.Project;

import java.util.List;

public class GetProjectResult {
    private List<Project> projects;
    private boolean success;

    public GetProjectResult(List<Project> projects, boolean success) {
        this.projects = projects;
        this.success = success;
    }

    public List<Project> getProjects() {
        return projects;
    }

    public void setProjects(List<Project> projects) {
        this.projects = projects;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}
