package edu.csula.directstem.ws.db;

import java.sql.*;

public class ConnectDB {
  static Connection con = null;
  public static Connection getConnection() {
    if (con != null)
      return con;
    // get db, user, pass from settings file
    return getConnection("directstem", "directstem", "directstem");
  }

  private static Connection getConnection(String db_name, String user_name, String password) {
    try {
      Class.forName("com.mysql.jdbc.Driver");
      con = DriverManager.getConnection("jdbc:mysql://localhost/" + db_name + "?user=" + user_name + "&password=" + password + "&serverTimezone=UTC&verifyServerCertificate=false&useSSL=true");
    } catch (Exception e) {
      e.printStackTrace();
    }

    return con;
  }
}
