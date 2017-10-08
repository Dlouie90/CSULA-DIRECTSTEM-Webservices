package edu.csula.directstem.ws;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Iterator;
import java.util.Map.Entry;
import java.util.UUID;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import edu.csula.directstem.ws.db.ConnectDB;

@Path("/comp")
public class Composite {
	@POST
	@Path("/add")
	@Consumes("application/json")
	@Produces("application/json")
	public static Response addComposite(String c) {
		try {
			JsonParser parser = new JsonParser();
			JsonObject g = (JsonObject) parser.parse(c);
			addComposite(g);
			return Response.status(200).build();
		}
		catch (Exception e) {
			return Response.status(500).entity(e).build();
		}
	}
	public static void addComposite(JsonObject j) throws Exception { //the in-out passing should be modified to use an object-oriented, "Real" Jersey model.
		Gson gson = new Gson();
		Connection conn = ConnectDB.getConnection();
		PreparedStatement p;
		p = conn.prepareStatement("insert into nodes values (?,?,?,?,?);");
		p.setInt(1, j.get("id").getAsInt());
		p.setInt(2, j.get("x").getAsInt());
		p.setInt(3, j.get("y").getAsInt());
		p.setInt(4, j.get("composition").getAsBoolean() ? 1 : 0); //can't cast boolean to int. dumb.
		p.setString(5, j.get("url").getAsString());
		p.executeUpdate();
		if(j.get("parameters").getAsJsonObject().size() > 0) {
			p = conn.prepareStatement("insert into parameters values (?,?,?);");
			for(Entry<String,JsonElement> entry : j.get("parameters").getAsJsonObject().entrySet()) {
				p.setInt(1, j.get("id").getAsInt());
				p.setString(2, entry.getKey());
				p.setString(3, entry.getValue().getAsString());
				p.addBatch();
			}
			p.executeBatch();
		}
		if(j.get("returns").getAsJsonObject().size() > 0) {
			p = conn.prepareStatement("insert into returns values (?,?,?);");
			for(Entry<String,JsonElement> entry : j.get("returns").getAsJsonObject().entrySet()) {
				p.setInt(1, j.get("id").getAsInt());
				p.setString(2, entry.getKey());
				p.setString(3, entry.getValue().getAsString());
				p.addBatch();
			}
			p.executeBatch();
		}
		if(j.get("children").getAsJsonArray().size() > 0) {
			p = conn.prepareStatement("insert into children values (?,?);");
			for(Iterator<JsonElement> i = j.get("children").getAsJsonArray().iterator(); i.hasNext();) {
				JsonObject child = i.next().getAsJsonObject();
				p.setInt(1, j.get("id").getAsInt());
				p.setInt(2, child.get("id").getAsInt());
				Composite.addComposite(child); //recurse
			}
		}
		if(j.get("edges").getAsJsonArray().size() > 0) { //sibling-to-sibling
			p = conn.prepareStatement("insert into edges values (?,?,?,?);");
			for(Iterator<JsonElement> i = j.get("edges").getAsJsonArray().iterator(); i.hasNext();) {
				JsonObject x = i.next().getAsJsonObject();
				p.setInt(1, j.get("id").getAsInt());
				p.setInt(2, x.get("srcId").getAsInt());
				p.setString(3, x.get("name").getAsString());
				p.setString(4, x.get("with").getAsString());
				p.addBatch();
			}
			p.executeBatch();
		}
		if(j.get("compEdges").getAsJsonArray().size() > 0) { //child-to-parent
			p = conn.prepareStatement("insert into compedges values (?,?,?,?);");
			for(Iterator<JsonElement> i = j.get("compEdges").getAsJsonArray().iterator(); i.hasNext();) {
				JsonObject x = i.next().getAsJsonObject();
				p.setInt(1, j.get("id").getAsInt());
				p.setInt(2, x.get("srcId").getAsInt());
				p.setString(3, x.get("name").getAsString());
				p.setString(4, x.get("with").getAsString());
				p.addBatch();
			}
			p.executeBatch();
		}
		if(j.get("childEdges").getAsJsonArray().size() > 0) { //parent-to-child
			p = conn.prepareStatement("insert into childedges values (?,?,?,?);");
			for(Iterator<JsonElement> i = j.get("childEdges").getAsJsonArray().iterator(); i.hasNext();) {
				JsonObject x = i.next().getAsJsonObject();
				p.setInt(1, j.get("id").getAsInt());
				p.setInt(2, x.get("destId").getAsInt());
				p.setString(3, x.get("name").getAsString());
				p.setString(4, x.get("with").getAsString());
				p.addBatch();
			}
			p.executeBatch();
		}
		if(j.get("inputs").getAsJsonObject().size() > 0) {
			p = conn.prepareStatement("insert into inputs values (?,?,?);");
			for(Entry<String,JsonElement> entry : j.get("parameters").getAsJsonObject().entrySet()) {
				p.setInt(1, j.get("id").getAsInt());
				p.setString(2, entry.getKey());
				p.setString(3, gson.toJson(entry.getValue()));
				p.addBatch();
			}
			p.executeBatch();
		}
		if(j.get("outputs").getAsJsonObject().size() > 0) {
			p = conn.prepareStatement("insert into outputs values (?,?,?);");
			for(Entry<String,JsonElement> entry : j.get("outputs").getAsJsonObject().entrySet()) {
				p.setInt(1, j.get("id").getAsInt());
				p.setString(2, entry.getKey());
				p.setString(3, gson.toJson(entry.getValue()));
				p.addBatch();
			}
			p.executeBatch();
		}
	}
	@POST
	@Path("/run")
	@Consumes("application/json")
	@Produces("application/json")
	public static Response runComposite(final String c) {
		UUID uuid = UUID.randomUUID();
		final String g = uuid.toString();
		try {
			Integer.parseInt(c);
		} catch (NumberFormatException e) {
			return Response.status(400).build();
		}
		new Thread(new Runnable() {
			String b = c;
			String guid = g;
		    public void run() {
				try {
					Gson gson = new Gson();
					JsonObject graph = Composite.getComposite(Integer.parseInt(b));
					JsonObject out = Composite.runComposite(graph,null).get("outputs").getAsJsonObject();
					Connection conn = ConnectDB.getConnection();
					PreparedStatement p = conn.prepareStatement("insert into results values (?,?,?,?,?);");
					for(Entry<String,JsonElement> entry : out.entrySet()) {
						p.setInt(1, Integer.parseInt(b));
						p.setString(2,guid);
						p.setString(3, entry.getKey());
						p.setString(4, gson.toJson(entry.getValue()));
						p.setBoolean(5, false); //failed
						p.addBatch();
					}
					p.executeBatch();
				} catch (Exception e) {
					Connection conn = ConnectDB.getConnection();
					try {
						PreparedStatement p = conn.prepareStatement("insert into results values (?,?,?,?,?);");
						p.setInt(1, Integer.parseInt(b));
						p.setString(2, guid);
						p.setString(3, null);
						p.setString(4, null);
						p.setBoolean(5, true);
						p.executeUpdate();
						e.printStackTrace();
					} catch (SQLException e1) {
						// give up; couldn't write error.
						e1.printStackTrace();
					}
				}
		    }
		}).start();
		return Response.ok().entity(g).build();
	}
	private static JsonObject runComposite(JsonObject j, JsonArray context) {
		if(j.get("childEdges").getAsJsonArray().size() > 0) {
			for(Iterator<JsonElement> i = j.get("childEdges").getAsJsonArray().iterator(); i.hasNext();) {
				JsonObject ch = i.next().getAsJsonObject();
				j.get("children").getAsJsonArray() //go to the appropriate child, and put the value from our 'with' input into their 'name' input.
					.get(Composite.findNode(j.get("children").getAsJsonArray(), ch.get("destId").getAsInt())).getAsJsonObject()
					.get("inputs").getAsJsonObject()
					.add(ch.get("name").getAsString(), j.get("inputs").getAsJsonObject().get(ch.get("with").getAsString()));
			}
		}
		if(j.get("compEdges").getAsJsonArray().size() > 0) {
			for(Iterator<JsonElement> i = j.get("compEdges").getAsJsonArray().iterator(); i.hasNext();) {
				JsonObject ed = i.next().getAsJsonObject();
				JsonObject edSrc = j.get("children").getAsJsonArray().get(Composite.findNode(j.get("children").getAsJsonArray(), ed.get("srcId").getAsInt())).getAsJsonObject(); //get the appropriate child
				if(edSrc.get("outputs").getAsJsonObject().get(ed.get("with").getAsString()).isJsonNull()) { //if the needed value is null, go get it. This could sort-of fall down if some service returns a bunch of nulls, but that's pretty unlikely?
					edSrc = Composite.runComposite(edSrc,j.get("children").getAsJsonArray());
					j.get("children").getAsJsonArray().set(ed.get("srcId").getAsInt(), edSrc); //update our child
				}
				j.get("outputs").getAsJsonObject().add(ed.get("name").getAsString(), edSrc.get("outputs").getAsJsonObject().get(ed.get("with").getAsString()));
			}
		}
		if(j.get("edges").getAsJsonArray().size() > 0) {
			for(Iterator<JsonElement> i = j.get("edges").getAsJsonArray().iterator(); i.hasNext();) {
				JsonObject ed = i.next().getAsJsonObject();
				JsonObject edSrc = context.get(Composite.findNode(context, ed.get("srcId").getAsInt())).getAsJsonObject(); //get the appropriate sibling
				if(edSrc.get("outputs").getAsJsonObject().get(ed.get("with").getAsString()).isJsonNull()) { //if the needed value is null, go get it. This could sort-of fall down if some service returns a bunch of nulls, but that's pretty unlikely?
					edSrc = Composite.runComposite(edSrc,context);
					context.set(ed.get("srcId").getAsInt(), edSrc); //update our sibling. this "should" be retained up-the-chain. I think. Probably.
				}
				j.get("outputs").getAsJsonObject().add(ed.get("name").getAsString(), edSrc.get("outputs").getAsJsonObject().get(ed.get("with").getAsString()));

			}
		}
		return j;
	}
	//right now only works with flat input objects (i.e. no inputs:{foo:3,bar:{baz:5}}), and doesn't work with urlencoded arguments
	private static JsonObject getResult(JsonObject j) throws MalformedURLException, IOException, RuntimeException {
		URL url = new URL(j.get("url").getAsString());
		Gson gson = new Gson();
		HttpURLConnection conn = (HttpURLConnection) url.openConnection();
		conn.setRequestMethod("GET");
		conn.setRequestProperty("Accept", "application/json");
		OutputStream o = conn.getOutputStream();
		o.write(gson.toJson(j.get("inputs").getAsJsonObject()).getBytes("UTF-8"));
		o.close();
		if (conn.getResponseCode() != 200) {
			throw new RuntimeException("Failed : HTTP error code : "
					+ conn.getResponseCode());
		}
		BufferedReader br = new BufferedReader(new InputStreamReader(
				(conn.getInputStream())));
		JsonParser parser = new JsonParser();
		return parser.parse(br).getAsJsonObject();
	}
	private static int findNode(JsonArray ja, int id) {
		for(int i = 0; i < ja.size(); i++) {
			if(ja.get(i).getAsInt() == id) return i;
		}
		return -1;
	}
	@GET
	@Path("/runresult")
	@Consumes("application/json")
	@Produces("application/json")
	public static Response resultComposite(String c) {
		Connection conn = ConnectDB.getConnection();
		JsonParser parser = new JsonParser();
		PreparedStatement p;
		try {
			p = conn.prepareStatement("select * from results where guid=?;");
			p.setString(1, c);
			ResultSet rs = p.executeQuery();
			if(rs.next()) {
				JsonObject res = new JsonObject();
				do {
					res.add(rs.getString(3), parser.parse(rs.getString(4)));
				} while(rs.next());
				return Response.status(200).entity(res).build();
			} else {
				return Response.status(400)
						.entity("{\"error\":\"No result found. Either you input an invalid GUID, your request has not finished running, or something has gone seriously wrong on the server.\"}")
						.build();
			}
		} catch (SQLException e) {
			e.printStackTrace();
			return Response.status(500).entity(e).build();
		}
	}
	@GET
	@Path("/getcomp")
	@Consumes("application/json")
	@Produces("application/json")
	public static Response getComposite(String c) {
		try {
			return Response.ok().entity(Composite.getComposite(Integer.parseInt(c))).build();
		} catch(SQLException e) {
			return Response.status(500).entity(e).build();
		}
	}
	private static JsonObject getComposite(int id) throws SQLException {
		JsonParser parser = new JsonParser();
		Connection conn = ConnectDB.getConnection();
		PreparedStatement p;
		p = conn.prepareStatement("select * from nodes where id=?;");
		p.setInt(1, id);
		ResultSet rs = p.executeQuery();
		rs.next();
		JsonObject ret = new JsonObject();
		ret.addProperty("id",id);
		ret.addProperty("x", rs.getInt(2));
		ret.addProperty("y", rs.getInt(3));
		ret.addProperty("composition", rs.getInt(4) > 0);
		ret.addProperty("url", rs.getString(5));
		ret.add("parameters",new JsonObject());
		p = conn.prepareStatement("select * from parameters where id=?;");
		p.setInt(1, id);
		rs = p.executeQuery();
		while(rs.next()) {
			ret.get("parameters").getAsJsonObject().addProperty(rs.getString(2), rs.getString(3));
		}
		ret.add("returns",new JsonObject());
		p = conn.prepareStatement("select * from returns where id=?;");
		p.setInt(1, id);
		rs = p.executeQuery();
		while(rs.next()) {
			ret.get("returns").getAsJsonObject().addProperty(rs.getString(2), rs.getString(3));
		}
		ret.add("children", new JsonArray());
		p = conn.prepareStatement("select * from children where id=?;");
		p.setInt(1, id);
		rs = p.executeQuery();
		while(rs.next()) {
			ret.get("children").getAsJsonArray().add(getComposite(rs.getInt(2))); //recurse
		}
		ret.add("edges", new JsonArray());
		p = conn.prepareStatement("select * from edges where id=?;");
		p.setInt(1, id);
		rs = p.executeQuery();
		while(rs.next()) {
			JsonObject edge = new JsonObject();
			edge.addProperty("srcId",rs.getInt(1));
			edge.addProperty("name",rs.getString(2));
			edge.addProperty("with",rs.getString(3));
			ret.get("edges").getAsJsonArray().add(edge);
		}
		ret.add("compEdges", new JsonArray());
		p = conn.prepareStatement("select * from compedges where id=?;");
		p.setInt(1, id);
		rs = p.executeQuery();
		while(rs.next()) {
			JsonObject edge = new JsonObject();
			edge.addProperty("srcId",rs.getInt(1));
			edge.addProperty("name",rs.getString(2));
			edge.addProperty("with",rs.getString(3));
			ret.get("compEdges").getAsJsonArray().add(edge);
		}
		ret.add("childEdges", new JsonArray());
		p = conn.prepareStatement("select * from childedges where id=?;");
		p.setInt(1, id);
		rs = p.executeQuery();
		while(rs.next()) {
			JsonObject edge = new JsonObject();
			edge.addProperty("destId",rs.getInt(1));
			edge.addProperty("name",rs.getString(2));
			edge.addProperty("with",rs.getString(3));
			ret.get("childEdges").getAsJsonArray().add(edge);
		}
		ret.add("inputs",new JsonObject());
		p = conn.prepareStatement("select * from inputs where id=?;");
		p.setInt(1, id);
		rs = p.executeQuery();
		while(rs.next()) {
			
			ret.get("parameters").getAsJsonObject().add(rs.getString(2), parser.parse(rs.getString(3)));
		}
		ret.add("parameters",new JsonObject());
		p = conn.prepareStatement("select * from parameters where id=?;");
		p.setInt(1, id);
		rs = p.executeQuery();
		while(rs.next()) {
			ret.get("parameters").getAsJsonObject().add(rs.getString(2), parser.parse(rs.getString(3)));
		}
		return ret;
	}
	@GET
	@Path("/list")
	@Consumes("application/json")
	@Produces("application/json")
	public static Response listComposite(String c) {
		return Response.status(200).build();
	}
	@POST
	@Path("/del")
	@Consumes("application/json")
	@Produces("application/json")
	public static Response delComposite(String c) {
		return Response.status(200).build();
	}
}