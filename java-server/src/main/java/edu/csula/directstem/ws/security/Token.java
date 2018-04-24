package edu.csula.directstem.ws.security;

import java.math.BigInteger;
import java.security.SecureRandom;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Random;

import edu.csula.directstem.model.User;
import edu.csula.directstem.ws.db.ConnectDB;

public class Token {
  // Changing this will invalidate all currently issued tokens and require
  // refactoring length checks in the verify method
  private static final String dateFormat = "yyyyMMddHHmm";
  
  private static final long tokenExpireTimeMillis = 1000 * 60 * 60 * 24;

  public static User verify(String token) {
    if (token.length() < 14 || token.length() > 150) {
      return null;
    }
    Connection conn = ConnectDB.getConnection();
    PreparedStatement p;
    ResultSet rs = null;
    try {
      p = conn.prepareStatement("SELECT * FROM users WHERE id=?");
      p.closeOnCompletion();

      p.setInt(1, Integer.parseInt(token.substring(12, token.indexOf('-'))));

      rs = p.executeQuery();

      if (rs.next()
          && token.equals(rs.getString(7))
          && (new SimpleDateFormat(dateFormat).parse(token.substring(0, 12)))
              .after(new Date(System.currentTimeMillis()))) {
        return new User(rs.getInt(1), rs.getString(2), rs.getString(3), rs.getString(4), rs.getString(5), rs.getString(6), rs.getString(7));
      } else {
        return null;
      }
    } catch (SQLException e) {
      e.printStackTrace();
      return null;
    } catch (NumberFormatException e) {
      return null;
    } catch (Exception e) {
      e.printStackTrace();
      return null;
    } finally {
      if (rs != null) {
        try {
          rs.close();
        } catch (SQLException e) {
          e.printStackTrace();
        }
      }
    }
  }

  public static String issue(User user) {
    Random random = new SecureRandom();
    String expire = new SimpleDateFormat(dateFormat).format(new Date(System.currentTimeMillis() + tokenExpireTimeMillis));
    String token = expire + user.getId() + "-" + (new BigInteger(512, random).toString(16));

    Connection conn = ConnectDB.getConnection();
    PreparedStatement p = null;
    try {
      p = conn.prepareStatement("UPDATE users SET token=? WHERE id=?");
      p.setString(1, token);
      p.setInt(2, user.getId());
      p.execute();

      return token;
    } catch (SQLException e) {
      e.printStackTrace();
      return null;
    } finally {
      if (p != null) {
        try {
          p.close();
        } catch (SQLException e) {
          e.printStackTrace();
        }
      }
    }
  }
}
