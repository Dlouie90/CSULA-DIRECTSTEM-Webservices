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

  public static boolean verify(String token) {
    if (token.length() < 14 || token.length() > 150) {
      return false;
    }
    Connection conn = ConnectDB.getConnection();
    PreparedStatement p;
    ResultSet rs = null;
    try {
      p = conn.prepareStatement("SELECT * FROM users WHERE id=?");
      p.closeOnCompletion();

      p.setInt(1, Integer.parseInt(token.substring(12, token.indexOf('-'))));

      rs = p.executeQuery();

      return token.equals(rs.getString(7)) && (new SimpleDateFormat(dateFormat).parse(token.substring(0, 12)))
          .after(new Date(System.currentTimeMillis()));
    } catch (SQLException e) {
      e.printStackTrace();
      return false;
    } catch (NumberFormatException e) {
      return false;
    } catch (Exception e) {
      e.printStackTrace();
      return false;
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
      p.executeQuery();

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
