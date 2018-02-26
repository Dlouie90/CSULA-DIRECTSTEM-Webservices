package edu.csula.directstem.data.user;

import edu.csula.directstem.data.user.UserContract.UserEntry;
import edu.csula.directstem.model.User;
import edu.csula.directstem.results.user.*;
import edu.csula.directstem.ws.db.ConnectDB;

import java.sql.Connection;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class UserDatabase {
  private static Connection connection = ConnectDB.getConnection();

  public static GetUsersResult getUsers() {
    String sql = "SELECT * FROM users ORDER BY id;";
    List<User> users = new ArrayList<>();
    boolean success = false;

    try {
      PreparedStatement preparedStatement = connection.prepareStatement(sql);
      ResultSet resultSet = preparedStatement.executeQuery();
      while (resultSet.next()) {
        users.add(toUser(resultSet));
      }

      success = true;
    } catch (SQLException e) {
      e.printStackTrace();
    }

    return new GetUsersResult(users, success);
  }

  public static GetUserByIdResult getUserById(int id) {
    String sql = "SELECT * FROM users WHERE id=? ORDER BY id;";
    User user = null;
    try {
      PreparedStatement preparedStatement = connection.prepareStatement(sql);
      preparedStatement.setInt(1, id);
      ResultSet resultSet = preparedStatement.executeQuery();
      if (resultSet.next()) {
        user = toUser(resultSet);
      }

    } catch (SQLException e) {
      e.printStackTrace();
    }
    return new GetUserByIdResult(id, user);
  }

  /**
     * Convert the current row in the ResultSet to a User object
     */
  private static User toUser(ResultSet resultSet) throws SQLException {
    int id = resultSet.getInt(UserEntry.ID);
    String firstName = resultSet.getString(UserEntry.FIRST_NAME);
    String lastName = resultSet.getString(UserEntry.LAST_NAME);
    String email = resultSet.getString(UserEntry.EMAIL);
    String password = resultSet.getString(UserEntry.PASSWORD);
    String description = resultSet.getString(UserEntry.USERNAME);
    return new User(id, firstName, lastName, email, password, description, null);
  }

  //Create user
  public static CreateUserResult createUser(User user) {
    String sql = "INSERT INTO users (firstname, lastname, email, username, passwordHash)"
        + " VALUES(?, ?, ?, ?, ?);";
    int rowCount = 0;
    PreparedStatement statement;
    try {
      statement = connection.prepareStatement(sql);
      statement.setString(1, user.getFirstName());
      statement.setString(2, user.getLastName());
      statement.setString(3, user.getEmail());
      statement.setString(4, user.getUsername());
      statement.setString(5, user.getPasswordHash());
      rowCount = statement.executeUpdate();
    } catch (SQLException e) {
      e.printStackTrace();
    }
    boolean successful = rowCount >= 1;
    return new CreateUserResult(user, successful);
  }

  public static DeleteUserByIdResult deleteUser(int id) {
    String sql = "DELETE FROM users WHERE id = ?";
    int rowDeleted = 0;
    try {
      PreparedStatement statement = connection.prepareStatement(sql);
      statement.setString(1, "" + id);
      rowDeleted = statement.executeUpdate();
    } catch (SQLException e) {
      e.printStackTrace();
    }
    return new DeleteUserByIdResult(id, rowDeleted > 0);
  }

  public static UpdateUserResult updateUser(User user, int id) {
    String sql = "UPDATE users SET firstname = ?, lastname=?, username=? WHERE id = ?";
    int rowsUpdated = 0;
    try {
      PreparedStatement statement = connection.prepareStatement(sql);
      statement.setString(1, user.getFirstName());
      statement.setString(2, user.getLastName());
      statement.setString(3, user.getUsername());
      statement.setInt(4, user.getId());
      rowsUpdated = statement.executeUpdate();

    } catch (SQLException e) {
      e.printStackTrace();
    }

    return new UpdateUserResult(id, user, rowsUpdated > 0);
  }
}
