package edu.csula.directstem.ws.security;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import edu.csula.directstem.model.User;
import edu.csula.directstem.ws.db.ConnectDB;

@Path("/register")
public class Register {
  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  public Response registerUser(Credentials credentials) {
    if (credentials.getUsername().length() < 1
        || credentials.getPassword().length() < 1) {
      return Response.status(400).build();
    }

    Connection conn = ConnectDB.getConnection();
    PreparedStatement p;
    try {
      p = conn.prepareStatement("insert into users (username, passwordHash) values (?,?);");
      p.setString(1, credentials.getUsername());
      p.setString(2, User.hashPassword(credentials.getPassword()));
      p.executeUpdate();
      return Response.ok().build();
    } catch (SQLException e) {
      e.printStackTrace();
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR).build();
    }
  }
}
