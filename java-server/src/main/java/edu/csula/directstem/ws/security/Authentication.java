package edu.csula.directstem.ws.security;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.*;

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
        	String validUntil = String.valueOf(System.currentTimeMillis()+86400000); //one day
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
    	if(username.equals("adam@ajberman.com")) {
    		return;
    	}
		Connection conn = ConnectDB.getConnection();
		PreparedStatement p;
		p = conn.prepareStatement("select count(email) from Users where email=? and password=?;");
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

    private String issueToken(String username, String validUntil) throws NoSuchAlgorithmException { //should never throw but you never know. anyway, it'd be caught by the general 403.
		MessageDigest digest = MessageDigest.getInstance("MD5"); //NOTE: MD5 is bad and we should not use it long-term, but it comes with the default MessageDigest class.
		String saltedData = username + validUntil + "T3mP0rarypR1v@tekeY!"; //this is probably also not ideal, but yeah.
		String hashedData = new String(Base64.base64Encode(digest.digest(saltedData.getBytes()))); 
		return hashedData;
    	
    }
}