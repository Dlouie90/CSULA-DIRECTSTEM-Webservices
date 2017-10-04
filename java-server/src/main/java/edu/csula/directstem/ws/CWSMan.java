package edu.csula.directstem.ws;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Iterator;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import edu.csula.directstem.model.Graph;
import edu.csula.directstem.ws.db.ConnectDB;
import edu.csula.directstem.ws.security.Secured;

@Path("/cws")
public class CWSMan {
	@POST
	@Path("/addcws")
	@Consumes("application/json")
	public Response addWebService(String gs) { //adds a ws
		JsonParser parser = new JsonParser();
		JsonObject g = (JsonObject) parser.parse(gs);
		return addWebService(g, true);
	}
	private Response addWebService(JsonObject g, boolean root) {
		Connection conn = ConnectDB.getConnection();
		PreparedStatement p;
		try {
			//Was specifically instructed not to use hibernate, so here we go doing it the old-fashioned way.
			p = conn.prepareStatement("insert into graphs values (?,?,?,?,?,?,?,?,?,?,?);");
			p.setInt(1, g.get("id").getAsInt());
			p.setInt(2, g.get("x").getAsInt());
			p.setInt(3, g.get("y").getAsInt());
			if(g.has("title")) {
				p.setString(4, g.get("title").getAsString());
			} else {
				p.setString(4, "");
			}
			if(g.has("description")) {
				p.setString(5, g.get("description").getAsString());
			} else {
				p.setString(5, "");
			}
			if(g.has("type")) {
				p.setString(6, g.get("type").getAsString());
			} else {
				p.setString(6, "");
			}
			if(g.has("domain")) {
				p.setString(7, g.get("domain").getAsString());
			} else {
				p.setString(7, "");
			}
			if(g.has("path")) {
				p.setString(8, g.get("path").getAsString());
			} else {
				p.setString(8, "");
			}
			p.setBoolean(9, g.get("isInput").getAsBoolean());
			p.setBoolean(10, g.get("isOutput").getAsBoolean());
			p.setBoolean(11, root);
			p.executeUpdate();
			for(Iterator<JsonElement> i = g.get("children").getAsJsonArray().iterator(); i.hasNext();) {
				JsonObject child = i.next().getAsJsonObject();
				this.addWebService(child, false); //current without deduping, need to think this through
				p = conn.prepareStatement("insert into children values (?,?);");
				p.setInt(1, g.get("id").getAsInt());
				p.setInt(2, child.get("id").getAsInt());
				p.executeUpdate();
			}
			for(Iterator<JsonElement> i = g.get("neighbors").getAsJsonArray().iterator(); i.hasNext();) {
				JsonObject nb = i.next().getAsJsonObject();
				this.addWebService(nb, false); //current without deduping, need to think this through
				p = conn.prepareStatement("insert into neighbors values (?,?);");
				p.setInt(1, g.get("id").getAsInt());
				p.setInt(2, nb.get("id").getAsInt());
				p.executeUpdate();
			}
			if(g.has("parameters")) {
				for(Iterator<JsonElement> i = g.get("parameters").getAsJsonArray().iterator(); i.hasNext();) {
					JsonObject nb = i.next().getAsJsonObject();
					p = conn.prepareStatement("insert into parameters values (?,?,?,?);");
					p.setInt(1, g.get("id").getAsInt());
					p.setString(2, nb.get("name").getAsString());
					p.setString(3, nb.get("dataType").getAsString());
					p.setString(4, nb.get("description").getAsString());
					p.executeUpdate();
				}
			}
			if(g.has("returnValues")) {
				for(Iterator<JsonElement> i = g.get("returnValues").getAsJsonArray().iterator(); i.hasNext();) {
					JsonObject nb = i.next().getAsJsonObject();
					p = conn.prepareStatement("insert into returnvalues values (?,?,?,?);");
					p.setInt(1, g.get("id").getAsInt());
					p.setString(2, nb.get("name").getAsString());
					p.setString(3, nb.get("dataType").getAsString());
					p.setString(4, nb.get("description").getAsString());
					p.executeUpdate();
				}
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			Gson gson = new Gson();
			return Response.ok(gson.toJson(e)).status(500).build();
		}
		return Response.status(200).build();
	}
	@GET
	@Path("/callws")
	@Produces("application/json")
	public String callWebService(@QueryParam("ws") String webService) { //invokes a saved ws graph
		return "{'error':'Not Implemented'}";
	}
	@GET
	@Path("/ws")
	@Produces("application/json")
	public Response getWebService(@QueryParam("ws") int webService) {
		Gson gson = new Gson();
		JsonObject ws = null;
		try {
			ws = this.getWS(webService);
			return Response.ok(gson.toJson(ws)).build();
		} catch (Exception e) {
			e.printStackTrace();
			return Response.ok(gson.toJson(e)).status(500).build();
		}
	}
	private JsonObject getWS(int id) throws Exception { //definitely has potential to recur infinitely. do not link stuff recursively.
		Connection conn = ConnectDB.getConnection();
		PreparedStatement p;
		p = conn.prepareStatement("select * from graphs where id=?;");
		p.setInt(1, id);
		ResultSet rs = p.executeQuery();
		rs.next();
		JsonObject j = new JsonObject();
		j.addProperty("id", rs.getInt(1));
		j.addProperty("x", rs.getInt(2));
		j.addProperty("y", rs.getInt(3));
		j.addProperty("title", rs.getString(4));
		j.addProperty("description", rs.getString(5));
		j.addProperty("type", rs.getString(6));
		j.addProperty("domain", rs.getString(7));
		j.addProperty("path", rs.getString(8));
		j.addProperty("isInput", rs.getBoolean(9));
		j.addProperty("isOutput", rs.getBoolean(10));
		j.add("children",new JsonArray());
		j.add("neighbors",new JsonArray());
		j.add("parameters",new JsonArray());
		j.add("returnValues",new JsonArray());
		p = conn.prepareStatement("select * from children where parentid=?;");
		p.setInt(1, id);
		rs = p.executeQuery();
		while(rs.next()) {
			int childId = rs.getInt(2);
			JsonObject child = this.getWS(childId);
			j.get("children").getAsJsonArray().add(child);
		}
		p = conn.prepareStatement("select * from neighbors where fromid=?;");
		p.setInt(1, id);
		rs = p.executeQuery();
		while(rs.next()) {
			int nId = rs.getInt(2);
			JsonObject n = this.getWS(nId);
			j.get("neighbors").getAsJsonArray().add(n);
		}
		p = conn.prepareStatement("select * from parameters where id=?;");
		p.setInt(1, id);
		rs = p.executeQuery();
		while(rs.next()) {
			JsonObject par = new JsonObject();
			par.addProperty("name", rs.getString(1));
			par.addProperty("dataType", rs.getString(2));
			par.addProperty("description", rs.getString(3));
			j.get("parameters").getAsJsonArray().add(par);
		}
		p = conn.prepareStatement("select * from returnvalues where id=?;");
		p.setInt(1, id);
		rs = p.executeQuery();
		while(rs.next()) {
			JsonObject par = new JsonObject();
			par.addProperty("name", rs.getString(1));
			par.addProperty("dataType", rs.getString(2));
			par.addProperty("description", rs.getString(3));
			j.get("returnValues").getAsJsonArray().add(par);
		}
		return j;
	}
	@GET
	@Path("/listservices")
	@Produces("application/json")
	public String getListServices() {
		Gson gson = new Gson();
		Connection conn = ConnectDB.getConnection();
		PreparedStatement p;
		JsonArray ja = new JsonArray();
		try {
			p = conn.prepareStatement("select * from graphs where root=1;");
			ResultSet rs = p.executeQuery();
			while(rs.next()) {
				JsonObject j = new JsonObject();
				j.addProperty("id", rs.getInt(1));
				j.addProperty("x", rs.getInt(2));
				j.addProperty("y", rs.getInt(3));
				j.addProperty("title", rs.getString(4));
				j.addProperty("description", rs.getString(5));
				j.addProperty("type", rs.getString(6));
				j.addProperty("domain", rs.getString(7));
				j.addProperty("path", rs.getString(8));
				j.addProperty("isInput", rs.getBoolean(9));
				j.addProperty("isOutput", rs.getBoolean(10));
				ja.add(j);
			}
			return gson.toJson(ja);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return gson.toJson(e); //debug-only. potentially exposes important server-side stuff.
		}
	}
}