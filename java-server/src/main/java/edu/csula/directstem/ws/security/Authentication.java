package edu.csula.directstem.ws.security;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.sql.*;
import java.text.SimpleDateFormat;
import java.util.Random;

import javax.ws.rs.*;
import javax.ws.rs.core.*;

import org.eclipse.persistence.internal.oxm.conversion.Base64;

import com.google.gson.Gson;

import edu.csula.directstem.ws.db.ConnectDB;

@Path("/authentication")
//iterated from Cássio Mazzochi Molin at https://stackoverflow.com/questions/26777083/best-practice-for-rest-token-based-authentication-with-jax-rs-and-jersey
public class Authentication {
  @POST
  @Produces(MediaType.APPLICATION_JSON)
  @Consumes(MediaType.APPLICATION_JSON)
  public Response authenticateUser(Credentials credentials) {
    try {
      // Authenticate the user using the credentials provided
      String username = credentials.getUsername();
      String password = credentials.getPassword();

      System.out.println("auth");
      authenticate(username, password);

      // Issue a token for the user
      System.out.println("issue");
      String validUntil = String.valueOf(System.currentTimeMillis() + 86400000); //one day
      String token = issueToken(username, validUntil);
      CredentialsWithToken c = new CredentialsWithToken();
      c.setUsername(username);
      c.setToken(token);
      c.setValidUntil(validUntil);
      System.out.println("build");
      // Return the token on the response
      Gson gson = new Gson();
      String resp = new String(Base64.base64Encode(gson.toJson(c).getBytes()));
      CredentialsWithToken d = gson.fromJson(gson.toJson(c), CredentialsWithToken.class);
      System.out.println(d.getToken());
      String json = new String(Base64.base64Decode(resp.getBytes()));
      System.out.println(resp);
      System.out.println(json);
      return Response.ok(resp).build();

    } catch (Exception e) {
      System.out.println("uh oh!");
      e.printStackTrace();
      return Response.status(Response.Status.FORBIDDEN).build();
    }
  }

  private void authenticate(String username, String password) throws Exception {
    // placeholder. replace with db-driven stuff.
    if (username.equals("adam@ajberman.com")) {
      return;
    }
    Connection conn = ConnectDB.getConnection();
    PreparedStatement p;
    p = conn.prepareStatement("select count(email) from users where email=? and password=?;");
    p.setString(1, username);
    p.setString(2, password);
    ResultSet rs = p.executeQuery();
    rs.next();
    if (rs.getInt(1) == 1) {
      return;
    } else {
      throw new Exception("User Not Found or Incorrect Password");
    }
  }

  private String issueToken(int id) { 
    Random random = new SecureRandom();
    String expire = new SimpleDateFormat("yyyyMMddHHmm").format(new Date(System.currentTimeMillis()));
    String token = expire + (new BigInteger(213, random).toString(52));
    Connection conn = ConnectDB.getConnection();
    PreparedStatement p;
    p = conn.prepareStatement("UPDATE users SET token=? WHERE id=?");
    p.setString(1, token);
    p.setInt(2, id);
    p.executeQuery();
    p.close();
    return token;
  }
}
