package edu.csula.directstem.data.project;

import edu.csula.directstem.model.Project;
import edu.csula.directstem.results.project.*;
import edu.csula.directstem.ws.db.ConnectDB;
import edu.csula.directstem.data.project.ProjectContract.ProjectEntry;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ProjectDatabase {
    private static Connection connection = ConnectDB.getConnection();

    public static GetProjectResult getProjects() {
        String sql = "SELECT * FROM projects ORDER BY id;";
        List<Project> projects = new ArrayList<>();
        boolean success = false;

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            ResultSet resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                projects.add(toProject(resultSet));
            }

            success = true;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return new GetProjectResult(projects, success);
    }

    public static GetProjectByIdResult getProjectById(int id) {
        String sql = "SELECT * FROM users WHERE id=? ORDER BY id;";
        Project project = null;
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1, id);
            ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                project = toProject(resultSet);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return new GetProjectByIdResult(id, project);
    }

    public static Project toProject(ResultSet resultSet) throws SQLException {
        int id = resultSet.getInt(ProjectEntry.ID);
        String data = resultSet.getString(ProjectEntry.DATA);
        return new Project(id, data);
    }

    public static CreateProjectResult createProject(Project project) {
        System.out.println("data to push: " + project.getData());
        int projectId = -1;
        
        try {
        	String sql = "INSERT INTO projects (data) VALUES(?)";
        	PreparedStatement statement;
            statement = connection.prepareStatement(sql);
            statement.setString(1, project.getData());
            int rowCount = statement.executeUpdate();
            
            sql = "SELECT LAST_INSERT_ID();";
            statement = connection.prepareStatement(sql);
            ResultSet resultSet = statement.executeQuery();
            
            if(rowCount > 0 && resultSet.next())
            	projectId = resultSet.getInt("LAST_INSERT_ID()");
            //rowCount = statement.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("CREATED NEW PROJECT WITH ID: " + projectId);
        boolean successful = projectId != -1;
        if(successful)
        	project.setId(projectId);
        return new CreateProjectResult(projectId, project, successful);
    }

    public static DeleteProjectByIdResult deleteProject(int id) {
        String sql = "DELETE FROM projects WHERE id = ?";
        int rowDeleted = 0;
        try {
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setString(1, "" + id);
            rowDeleted = statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return new DeleteProjectByIdResult(id, rowDeleted > 0);
    }

    public static UpdateProjectResult updateProject(Project project, int id) {
    	System.out.println("data to update: " + project.getData());
        String sql = "UPDATE projects SET data = ? WHERE id = ?";
        int rowsUpdated = 0;
        try {
            PreparedStatement statement = connection.prepareStatement(sql);
            statement.setString(1, project.getData());
            statement.setInt(2, project.getId());
            rowsUpdated = statement.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return new UpdateProjectResult(id, project, rowsUpdated > 0);
    }

}
