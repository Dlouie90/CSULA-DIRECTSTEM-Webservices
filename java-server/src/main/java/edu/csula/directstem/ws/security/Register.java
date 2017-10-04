package edu.csula.directstem.ws.security;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.sql.*;

import javax.ws.rs.*;
import javax.ws.rs.core.*;

import edu.csula.directstem.ws.db.ConnectDB;

@Path("/register")
public class Register {
	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response registerUser(Credentials credentials) {
		Connection conn = ConnectDB.getConnection();
		PreparedStatement p;
		try {
			p = conn.prepareStatement("insert into Users values (?,?);");
			p.setString(1, credentials.getUsername());
			p.setString(2, credentials.getPassword());
			p.executeUpdate();
			return Response.ok().build();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
        	StringWriter sw = new StringWriter();
        	e.printStackTrace(new PrintWriter(sw));
        	String exceptionAsString = sw.toString();
            return Response.ok(exceptionAsString).build();
			//return Response.status(Response.Status.CONFLICT).build();
		}
	}
}