package edu.csula.directstem.ws;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.StringWriter;
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
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonNull;
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
			StringWriter sw = new StringWriter();
			PrintWriter pw = new PrintWriter(sw);
			e.printStackTrace(pw);
			String sStackTrace = sw.toString(); // stack trace as a string
			return Response.status(500).entity(sStackTrace).build();
		}
	}
	public static void addComposite(JsonObject j) throws Exception { //the in-out passing should be modified to use an object-oriented, "Real" Jersey model.
		Gson gson = new Gson();
		Connection conn = ConnectDB.getConnection();
		PreparedStatement p;
		p = conn.prepareStatement("insert into nodes values (?,?,?,?,?);");
		p.setInt(1, j.get("id").getAsInt());
		if(j.has("x")) p.setInt(2, j.get("x").getAsInt());
		else p.setNull(2, java.sql.Types.INTEGER);
		if(j.has("y")) p.setInt(3, j.get("y").getAsInt());
		else p.setNull(3, java.sql.Types.INTEGER);
		p.setInt(4, j.get("composition").getAsBoolean() ? 1 : 0); //can't cast boolean to int. dumb.
		p.setString(5, j.get("composition").getAsBoolean() ? null : j.get("url").getAsString());
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
		if(j.get("returnType").getAsJsonObject().size() > 0) {
			p = conn.prepareStatement("insert into returns values (?,?,?);");
			for(Entry<String,JsonElement> entry : j.get("returnType").getAsJsonObject().entrySet()) {
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
				p.addBatch();
				Composite.addComposite(child); //recurse
			}
			p.executeBatch();
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
			for(Entry<String,JsonElement> entry : j.get("inputs").getAsJsonObject().entrySet()) {
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
	public static Response runComposite(String c) {
		JsonParser parser = new JsonParser();
		final int id = parser.parse(c).getAsJsonObject().get("id").getAsInt();
		UUID uuid = UUID.randomUUID();
		final String g = uuid.toString();
		new Thread(new Runnable() {
			int b = id;
			String guid = g;
		    public void run() {
				try {
					Gson gson = new Gson();
					JsonObject graph = Composite.getComposite(b);
					JsonObject out = Composite.runComposite(graph,null).get("outputs").getAsJsonObject();
					Connection conn = ConnectDB.getConnection();
					PreparedStatement p = conn.prepareStatement("insert into results values (?,?,?,?,?);");
					for(Entry<String,JsonElement> entry : out.entrySet()) {
						p.setInt(1, b);
						p.setString(2,guid);
						p.setString(3, entry.getKey());
						p.setString(4, gson.toJson(entry.getValue()));
						p.setBoolean(5, false); //failed
						p.addBatch();
					}
					p.executeBatch();
				} catch (Exception e) {
					e.printStackTrace();
					Connection conn = ConnectDB.getConnection();
					try {
						PreparedStatement p = conn.prepareStatement("insert into results values (?,?,?,?,?);");
						p.setInt(1, b);
						p.setString(2, guid);
						p.setString(3, null);
						p.setString(4, null);
						p.setBoolean(5, true);
						p.executeUpdate();
					} catch (SQLException e1) {
						// give up; couldn't write error.
						e1.printStackTrace();
					}
				}
		    }
		}).start();
		JsonObject res = new JsonObject();
		res.addProperty("guid", g);
		Gson gson = new Gson();
		return Response.ok().entity(gson.toJson(res)).build();
	}
	private static JsonObject runComposite(JsonObject j, JsonArray context) throws Exception {
		if(j.get("childEdges").getAsJsonArray().size() > 0) {
			for(Iterator<JsonElement> i = j.get("childEdges").getAsJsonArray().iterator(); i.hasNext();) {
				JsonObject ch = i.next().getAsJsonObject();
				j.get("children").getAsJsonArray() //go to the appropriate child, and put the value from our 'with' input into their 'name' input.
					.get(Composite.findNode(j.get("children").getAsJsonArray(), ch.get("destId").getAsInt())).getAsJsonObject()
					.get("inputs").getAsJsonObject()
					.add(ch.get("name").getAsString(), j.get("inputs").getAsJsonObject().get(ch.get("with").getAsString()));
			}
		}
		if(j.get("edges").getAsJsonArray().size() > 0) {
			for(Iterator<JsonElement> i = j.get("edges").getAsJsonArray().iterator(); i.hasNext();) {
				JsonObject ed = i.next().getAsJsonObject();
				JsonObject edSrc = context.get(Composite.findNode(context, ed.get("srcId").getAsInt())).getAsJsonObject(); //get the appropriate sibling
				System.out.println(ed.get("with").getAsString());
				System.out.println(edSrc.get("id").getAsInt());
				if(edSrc.get("outputs").getAsJsonObject().get(ed.get("with").getAsString()).isJsonNull()) { //if the needed value is null, go get it. This could sort-of fall down if some service returns a bunch of nulls, but that's pretty unlikely?
					edSrc = Composite.runComposite(edSrc,context);
					context.set(findNode(context,ed.get("srcId").getAsInt()), edSrc); //update our sibling. this "should" be retained up-the-chain. I think. Probably.
				}
				j.get("inputs").getAsJsonObject().add(ed.get("name").getAsString(), edSrc.get("outputs").getAsJsonObject().get(ed.get("with").getAsString()));
			}
		}
		if(!j.get("composition").getAsBoolean()) {
			j.add("outputs", Composite.getResult(j));
		} else {
			if(j.get("compEdges").getAsJsonArray().size() > 0) {
				for(Iterator<JsonElement> i = j.get("compEdges").getAsJsonArray().iterator(); i.hasNext();) {
					JsonObject ed = i.next().getAsJsonObject();
					JsonObject edSrc = j.get("children").getAsJsonArray().get(Composite.findNode(j.get("children").getAsJsonArray(), ed.get("srcId").getAsInt())).getAsJsonObject(); //get the appropriate child
					System.out.println(ed.get("with").getAsString());
					System.out.println(edSrc.get("id").getAsInt());
					System.out.println(j.get("id").getAsInt());
					if(edSrc.get("outputs").getAsJsonObject().get(ed.get("with").getAsString()).isJsonNull()) { //if the needed value is null, go get it. This could sort-of fall down if some service returns a bunch of nulls, but that's pretty unlikely?
						edSrc = Composite.runComposite(edSrc,j.get("children").getAsJsonArray());
						j.get("children").getAsJsonArray().set(findNode(j.get("children").getAsJsonArray(),ed.get("srcId").getAsInt()), edSrc); //update our child
					}
					j.get("outputs").getAsJsonObject().add(ed.get("name").getAsString(), edSrc.get("outputs").getAsJsonObject().get(ed.get("with").getAsString()));
				}
			}
		}
		return j;
	}
	//right now only works with flat input objects (i.e. no inputs:{foo:3,bar:{baz:5}}), and doesn't work with urlencoded arguments
	private static JsonObject getResult(JsonObject j) throws MalformedURLException, IOException, RuntimeException {
		String u = j.get("url").getAsString();
		boolean first = true;
		if(j.get("inputs").getAsJsonObject().size() > 0) {
			for(Entry<String,JsonElement> entry : j.get("inputs").getAsJsonObject().entrySet()) {
				if(!entry.getValue().isJsonNull()) {
					if(first) {
						u = u + "?" + entry.getKey() + "=" + entry.getValue().getAsString();
						first = false;
					}
					else {
						u = u + "&" + entry.getKey() + "=" + entry.getValue().getAsString();
					}
				}
			}
		}
		System.out.println("final url is " + u);
		URL url = new URL(u);
		Gson gson = new Gson();
		HttpURLConnection conn = (HttpURLConnection) url.openConnection();
		conn.setDoOutput(true);
		conn.setRequestMethod("GET");
		conn.setRequestProperty("Accept", "application/json");
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
		System.out.println("Looking for " + id + "in a context of " + ja.size() + " nodes.");
		for(int i = 0; i < ja.size(); i++) {
			if(ja.get(i).getAsJsonObject().get("id").getAsInt() == id) return i;
		}
		return -1;
	}
	@GET
	@Path("/runresult")
	@Consumes("application/json")
	@Produces("application/json")
	public static Response resultComposite(@QueryParam("run") String c) {
		Connection conn = ConnectDB.getConnection();
		JsonParser parser = new JsonParser();
		PreparedStatement p;
		try {
			p = conn.prepareStatement("select * from results where guid=?;");
			p.setString(1, c);
			ResultSet rs = p.executeQuery();
			if(rs.next()) {
				if(rs.getBoolean(5)) {
					Gson gson = new Gson();
					return Response.status(200).entity("{\"failed\":true}").build();
				} else {
					JsonObject res = new JsonObject();
					do {
						if(rs.getString(4).equals("null")) {
							res.add(rs.getString(3),JsonNull.INSTANCE);
						} else {
							res.add(rs.getString(3), parser.parse(rs.getString(4)));
						}
					} while(rs.next());
					Gson gson = new Gson();
					return Response.status(200).entity(gson.toJson(res)).build();
				}
			} else {
				return Response.status(400)
						.entity("{\"error\":\"No result found. Either you input an invalid GUID, your request has not finished running, or something has gone seriously wrong on the server.\"}")
						.build();
			}
		} catch (SQLException e) {
			StringWriter sw = new StringWriter();
			PrintWriter pw = new PrintWriter(sw);
			e.printStackTrace(pw);
			String sStackTrace = sw.toString(); // stack trace as a string
			return Response.status(500).entity(sStackTrace).build();
		}
	}
	@GET
	@Path("/getcomp")
	@Consumes("application/json")
	@Produces("application/json")
	public static Response getComposite(@QueryParam("id") String c) {
		try {
			Gson gson = new GsonBuilder().serializeNulls().create();
			return Response.ok().entity(gson.toJson(Composite.getComposite(Integer.parseInt(c)))).build();
		} catch(SQLException e) {
			StringWriter sw = new StringWriter();
			PrintWriter pw = new PrintWriter(sw);
			e.printStackTrace(pw);
			String sStackTrace = sw.toString(); // stack trace as a string
			return Response.status(500).entity(sStackTrace).build();
		}
	}
	private static JsonObject getComposite(int id) throws SQLException {
		System.out.println("Getting " + id);
		JsonParser parser = new JsonParser();
		Connection conn = ConnectDB.getConnection();
		PreparedStatement p;
		p = conn.prepareStatement("select * from nodes where id=?;");
		p.setInt(1, id);
		ResultSet rs = p.executeQuery();
		rs.next();
		JsonObject ret = new JsonObject();
		ret.addProperty("id",id);
		int temp = rs.getInt(2);
		if(!rs.wasNull()) ret.addProperty("x", rs.getInt(2));
		temp = rs.getInt(3);
		if(!rs.wasNull()) ret.addProperty("y", rs.getInt(3));
		ret.addProperty("composition", rs.getInt(4) > 0);
		ret.addProperty("url", rs.getString(5));
		ret.add("parameters",new JsonObject());
		p = conn.prepareStatement("select * from parameters where id=?;");
		p.setInt(1, id);
		rs = p.executeQuery();
		while(rs.next()) {
			ret.get("parameters").getAsJsonObject().addProperty(rs.getString(2), rs.getString(3));
		}
		ret.add("returnType",new JsonObject());
		p = conn.prepareStatement("select * from returns where id=?;");
		p.setInt(1, id);
		rs = p.executeQuery();
		while(rs.next()) {
			ret.get("returnType").getAsJsonObject().addProperty(rs.getString(2), rs.getString(3));
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
			edge.addProperty("srcId",rs.getInt(2));
			edge.addProperty("name",rs.getString(3));
			edge.addProperty("with",rs.getString(4));
			ret.get("edges").getAsJsonArray().add(edge);
		}
		ret.add("compEdges", new JsonArray());
		p = conn.prepareStatement("select * from compedges where id=?;");
		p.setInt(1, id);
		rs = p.executeQuery();
		while(rs.next()) {
			JsonObject edge = new JsonObject();
			edge.addProperty("srcId",rs.getInt(2));
			edge.addProperty("name",rs.getString(3));
			edge.addProperty("with",rs.getString(4));
			ret.get("compEdges").getAsJsonArray().add(edge);
		}
		ret.add("childEdges", new JsonArray());
		p = conn.prepareStatement("select * from childedges where id=?;");
		p.setInt(1, id);
		rs = p.executeQuery();
		while(rs.next()) {
			JsonObject edge = new JsonObject();
			edge.addProperty("destId",rs.getInt(2));
			edge.addProperty("name",rs.getString(3));
			edge.addProperty("with",rs.getString(4));
			ret.get("childEdges").getAsJsonArray().add(edge);
		}
		ret.add("inputs",new JsonObject());
		p = conn.prepareStatement("select * from inputs where id=?;");
		p.setInt(1, id);
		rs = p.executeQuery();
		while(rs.next()) {
			ret.get("inputs").getAsJsonObject().add(rs.getString(2), parser.parse(rs.getString(3)));
		}
		ret.add("outputs",new JsonObject());
		p = conn.prepareStatement("select * from outputs where id=?;");
		p.setInt(1, id);
		rs = p.executeQuery();
		while(rs.next()) {
			System.out.println("Output: " + rs.getInt(1) + "," + rs.getString(2) + "," + rs.getString(3));
			ret.get("outputs").getAsJsonObject().add(rs.getString(2), parser.parse(rs.getString(3)));
		}
		return ret;
	}
	@GET
	@Path("/list")
	@Produces("application/json")
	public static Response listComposite(String c) {
		return Response.status(200).build();
	}
	@POST
	@Path("/del")
	@Consumes("application/json")
	@Produces("application/json")
	public static Response delComposite(String c) {
		JsonParser parser = new JsonParser();
		int id = parser.parse(c).getAsJsonObject().get("id").getAsInt();
		if(deleteComposite(id)) {
			return Response.status(200).build();
		} else {
			return Response.status(500).build();
		}
	}
	private static boolean deleteComposite(int id) {
		Connection conn = ConnectDB.getConnection();
		PreparedStatement p;
		try {
			p = conn.prepareStatement("select childid from children where id=?;");
			p.setInt(1, id);
			ResultSet rs = p.executeQuery();
			while(rs.next()) {
				deleteComposite(rs.getInt(1));
			}
			p = conn.prepareStatement("delete from inputs where id=?; delete from outputs where id=?; delete from childedges where id=?; delete from edges where id=?; delete from compedges where id=?; delete from returns where id=?; delete from parameters where id=?;delete from nodes where id=?;");
			p.setInt(1, id);
			p.setInt(2, id);
			p.setInt(3, id);
			p.setInt(4, id);
			p.setInt(5, id);
			p.setInt(6, id);
			p.setInt(7, id);
			p.setInt(8, id);
			p.executeUpdate();
			return true;
		} catch (SQLException e) {
			e.printStackTrace();
			return false;
		}
		
	}
}