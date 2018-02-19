package edu.csula.directstem.data.project;

import edu.csula.directstem.model.Project;
import edu.csula.directstem.results.GetProjectResult;
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

    public static Project toProject(ResultSet resultSet) throws SQLException {
        int id = resultSet.getInt(ProjectEntry.ID);
        String title = resultSet.getString(ProjectEntry.TITLE);
        String description = resultSet.getString(ProjectEntry.DESCRIPTION);
        return new Project(id, title, description);
    }

}
