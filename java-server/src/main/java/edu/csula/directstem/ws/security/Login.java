package edu.csula.directstem.ws.security;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Collections;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.google.gson.Gson;

import edu.csula.directstem.model.User;
import edu.csula.directstem.ws.db.ConnectDB;

@Path("/login")
public class Login {
  @POST
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
  public Response logIn(Credentials credentials) {
    try {
      String username = credentials.getUsername();
      String password = credentials.getPassword();

      User user = getUser(username);

      if (user != null && user.isPasswordValid(password)) {
        return Response.ok((new Gson()).toJson(Collections.singletonMap("token", Token.issue(user)))).build();
      } else {
        return Response.status(Response.Status.BAD_REQUEST).build();
      }
    } catch (Exception e) {
      e.printStackTrace();
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
    }
  }

  private User getUser(String username) {    
    Connection conn = ConnectDB.getConnection();
    PreparedStatement p;
    ResultSet rs = null;
    try {
      p = conn.prepareStatement("SELECT * FROM users WHERE username=?;");
      p.closeOnCompletion();

      p.setString(1, username);

      rs = p.executeQuery();

      rs.next();

      return new User(rs.getInt(1), rs.getString(2), rs.getString(3), rs.getString(4), rs.getString(5), rs.getString(6), rs.getString(7));
    } catch (SQLException e) {
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
}
