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
import java.sql.Statement;
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
	@POST
	@Path("/addservice")
	@Consumes("application/json")
	public static Response addService(String c) {
		try {
			JsonParser parser = new JsonParser();
			JsonObject g = (JsonObject) parser.parse(c);
			addService(g);
			return Response.status(200).build();
		}
		catch (Exception e) {
			StringWriter sw = new StringWriter();
			PrintWriter pw = new PrintWriter(sw);
			e.printStackTrace(pw);
			String sStackTrace = sw.toString();
			return Response.status(500).entity(sStackTrace).build();
		}
	}
	public static int addService(JsonElement j) throws Exception {
		if(j.isJsonPrimitive()) return j.getAsInt(); //refers to a presumably-already-existing service.
		else {
			JsonObject s = j.getAsJsonObject();
			Connection conn = ConnectDB.getConnection();
			PreparedStatement p;
			p = conn.prepareStatement("select count(id) from services where id=?;");
			p.setInt(1,s.get("id").getAsInt());
			ResultSet rs = p.executeQuery();
			rs.next();
			if(rs.getInt(1) == 0) {
				p = conn.prepareStatement("insert into services values (?,?,?,?,?)");
				p.setInt(1, s.get("id").getAsInt());
				p.setString(2, s.get("url").getAsString());
				if(s.has("title")) p.setString(3, s.get("title").getAsString()); 
				else p.setNull(5, java.sql.Types.VARCHAR);
				if(s.has("description")) p.setString(4, s.get("description").getAsString()); 
				else p.setNull(5, java.sql.Types.VARCHAR);
				if(s.has("return")) p.setString(5, s.get("return").getAsString()); 
				else p.setNull(5, java.sql.Types.VARCHAR);
				p.executeUpdate();
				if(s.has("parameters") && s.get("parameters").getAsJsonArray().size() > 0) {
					p = conn.prepareStatement("insert into serviceparameters values (?,?,?);");
					int count = 1;
					for(Iterator<JsonElement> i = s.get("parameters").getAsJsonArray().iterator(); i.hasNext();) {
						p.setInt(1, s.get("id").getAsInt());
						p.setInt(2, count++);
						p.setString(3, i.next().getAsString());
						p.addBatch();
					}
					p.executeBatch();
				}
			} 
			return s.get("id").getAsInt();
		}
	}
	public static void addComposite(JsonObject j) throws Exception { //the in-out passing should be modified to use an object-oriented, "Real" Jersey model.
		Gson gson = new Gson();
		Connection conn = ConnectDB.getConnection();
		PreparedStatement p;
		//check if there's already a node by this id
		p = conn.prepareStatement("select count(id) from nodes where id=?;");
		p.setInt(1, j.get("id").getAsInt());
		ResultSet rs = p.executeQuery();
		rs.next();
		if(rs.getInt(1) > 0) return;
		p = conn.prepareStatement("insert into nodes values (?,?,?,?,?,?);");
		p.setInt(1, j.get("id").getAsInt());
		if(j.has("description") && !j.get("description").isJsonNull()) {
			p.setString(2, j.get("description").getAsString());
		} else {
			p.setNull(2, java.sql.Types.VARCHAR);
		}
		p.setInt(3, j.get("composition").getAsBoolean() ? 1 : 0); //can't cast boolean to int. dumb.
		if(!j.get("composition").getAsBoolean()) {
			p.setInt(4, addService(j.get("service")));
		} else {
			p.setNull(4, java.sql.Types.INTEGER);
		}
		if(j.get("compEdge").isJsonNull()) {
			p.setNull(5, java.sql.Types.INTEGER);
		} else {
			p.setInt(5, j.get("compEdge").getAsInt());
		}
		if(j.get("output").isJsonNull()) {
			p.setNull(6, java.sql.Types.VARCHAR);
		} else {
			p.setString(6, gson.toJson(j.get("output")));
		}
		p.executeUpdate();
		if(j.has("children") && j.get("children").getAsJsonArray().size() > 0) {
			System.out.println(gson.toJson(j.get("children")));
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
		if(j.has("inputs") && j.get("inputs").getAsJsonArray().size() > 0) {
			p = conn.prepareStatement("insert into inputs values (?,?,?);");
			for(int i = 0; i < j.get("inputs").getAsJsonArray().size(); i++) {
				p.setInt(1, j.get("id").getAsInt());
				p.setInt(2, i);
				try {
					p.setString(3, j.get("inputs").getAsJsonArray().get(i).getAsString());
				} catch(Exception e) {
					p.setString(3, j.get("inputs").getAsJsonArray().get(i).getAsNumber().toString());
				}
				p.addBatch();
			}
			p.executeBatch();
		}
		if(j.has("childEdges") && j.get("childEdges").getAsJsonArray().size() > 0) {
			p = conn.prepareStatement("insert into childedges values (?,?,?,?);");
			for(Iterator<JsonElement> i = j.get("childEdges").getAsJsonArray().iterator(); i.hasNext();) {
				JsonObject e = i.next().getAsJsonObject();
				p.setInt(1, j.get("id").getAsInt());
				p.setInt(2, e.get("destId").getAsInt());
				p.setInt(3, e.get("paramNo").getAsInt());
				p.setInt(4, e.get("inputNo").getAsInt());
				p.addBatch();
			}
			p.executeBatch();
		}
		if(j.has("edges") && j.get("edges").getAsJsonArray().size() > 0) {
			p = conn.prepareStatement("insert into edges values (?,?,?);");
			for(Iterator<JsonElement> i = j.get("edges").getAsJsonArray().iterator(); i.hasNext();) {
				JsonObject e = i.next().getAsJsonObject();
				p.setInt(1, j.get("id").getAsInt());
				p.setInt(2, e.get("srcId").getAsInt());
				p.setInt(3, e.get("paramNo").getAsInt());
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
					JsonElement out = Composite.runComposite(graph,null).get("output");
					System.out.println(out.toString());
					System.out.println(out.getAsNumber().toString());
					Connection conn = ConnectDB.getConnection();
					PreparedStatement p = conn.prepareStatement("insert into results values (?,?,?,?);");
					p.setInt(1, b);
					p.setString(2,guid);
					try {
						p.setString(3, out.getAsNumber().toString());
					} catch(Exception e) {
						p.setString(3, out.getAsString());
					}
					p.setBoolean(4, false); //failed
					p.executeUpdate();
				} catch (Exception e) {
					e.printStackTrace();
					Connection conn = ConnectDB.getConnection();
					try {
						PreparedStatement p = conn.prepareStatement("insert into results values (?,?,?,?);");
						p.setInt(1, b);
						p.setString(2, guid);
						p.setString(3, null);
						p.setBoolean(4, true);
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
		Gson gson = new Gson();
		if(j.get("childEdges").getAsJsonArray().size() > 0) {
			for(Iterator<JsonElement> i = j.get("childEdges").getAsJsonArray().iterator(); i.hasNext();) {
				JsonObject ch = i.next().getAsJsonObject();
				JsonArray dest = j.get("children").getAsJsonArray()
									.get(Composite.findNode(j.get("children").getAsJsonArray(), ch.get("destId").getAsInt())).getAsJsonObject()
									.get("inputs").getAsJsonArray();
				try {
					dest.set(ch.get("paramNo").getAsInt()-1, j.get("inputs").getAsJsonArray().get(ch.get("inputNo").getAsInt()-1));
				} catch(IndexOutOfBoundsException e) {
					while (dest.size() < ch.get("paramNo").getAsInt()) dest.add(JsonNull.INSTANCE); //pad out the array.
					dest.set(ch.get("paramNo").getAsInt()-1, j.get("inputs").getAsJsonArray().get(ch.get("inputNo").getAsInt()-1));
				}
			}
		}
		if(j.get("edges").getAsJsonArray().size() > 0) {
			for(Iterator<JsonElement> i = j.get("edges").getAsJsonArray().iterator(); i.hasNext();) {
				JsonObject ed = i.next().getAsJsonObject();
				JsonObject edSrc = context.get(Composite.findNode(context, ed.get("srcId").getAsInt())).getAsJsonObject(); //get the appropriate sibling
				System.out.println(ed.get("paramNo").getAsString());
				System.out.println(edSrc.get("id").getAsInt());
				if(!edSrc.has("output") || edSrc.get("output").isJsonNull()) { //if the needed value is null, go get it. This could sort-of fall down if some service returns a bunch of nulls, but that's pretty unlikely?
					edSrc = Composite.runComposite(edSrc,context);
					context.set(findNode(context,ed.get("srcId").getAsInt()), edSrc); //update our sibling. this "should" be retained up-the-chain. I think. Probably.
				}
				try {
					j.get("inputs").getAsJsonArray().set(ed.get("paramNo").getAsInt()-1, edSrc.get("output"));
				} catch(IndexOutOfBoundsException e) {
					while (j.get("inputs").getAsJsonArray().size() < ed.get("paramNo").getAsInt()) j.get("inputs").getAsJsonArray().add(JsonNull.INSTANCE); //pad out the array.
					j.get("inputs").getAsJsonArray().set(ed.get("paramNo").getAsInt()-1, edSrc.get("output"));
				}
			}
		}
		if(!j.get("composition").getAsBoolean()) {
			j.add("output", Composite.getResult(j));
		} else {
			if(j.has("compEdge") && !j.get("compEdge").isJsonNull()) {
				JsonObject edSrc = j.get("children").getAsJsonArray().get(Composite.findNode(j.get("children").getAsJsonArray(), j.get("compEdge").getAsInt())).getAsJsonObject(); //get the appropriate child
				System.out.println(edSrc.get("id").getAsInt());
				System.out.println(j.get("id").getAsInt());
				if(!edSrc.has("output") || edSrc.get("output").isJsonNull()) { //if the needed value is null, go get it. This could sort-of fall down if some service returns a bunch of nulls, but that's pretty unlikely?
					edSrc = Composite.runComposite(edSrc,j.get("children").getAsJsonArray());
					j.get("children").getAsJsonArray().set(findNode(j.get("children").getAsJsonArray(), j.get("compEdge").getAsInt()), edSrc); //update our child
				}
				j.add("output",edSrc.get("output"));
			} else {
				j.add("output",JsonNull.INSTANCE);
			}
		}
		System.out.println(gson.toJson(j));
		return j;
	}
	//right now only works with flat input objects (i.e. no inputs:{foo:3,bar:{baz:5}}), and doesn't work with urlencoded arguments
	private static JsonElement getResult(JsonObject j) throws Exception {
		String u = j.get("service").getAsJsonObject().get("url").getAsString();
		boolean first = true;
		Gson gson = new GsonBuilder().serializeNulls().create();
		System.out.println(gson.toJson(j.get("inputs")));
		System.out.println(gson.toJson(j.get("service").getAsJsonObject().get("parameters")));
		if(j.get("inputs").getAsJsonArray().size() > j.get("service").getAsJsonObject().get("parameters").getAsJsonArray().size()) throw new Exception("Wrong number of parameters.");
		if(j.get("inputs").getAsJsonArray().size() > 0) {
			for(int i = 0; i < j.get("inputs").getAsJsonArray().size(); i++) {
				if(!j.get("inputs").getAsJsonArray().get(i).isJsonNull()) {
					if(first) {
						try {
							u = u + "?" + j.get("service").getAsJsonObject().get("parameters").getAsJsonArray().get(i).getAsString() + "=" + j.get("inputs").getAsJsonArray().get(i).getAsNumber();
							first = false;
						} catch(Exception e) {
							u = u + "?" + j.get("service").getAsJsonObject().get("parameters").getAsJsonArray().get(i).getAsString() + "=" + j.get("inputs").getAsJsonArray().get(i).getAsString();
							first = false;
						}
					}
					else {
						try {
							u = u + "&" + j.get("service").getAsJsonObject().get("parameters").getAsJsonArray().get(i).getAsString() + "=" + j.get("inputs").getAsJsonArray().get(i).getAsNumber();
						} catch(Exception e) {
							u = u + "&" + j.get("service").getAsJsonObject().get("parameters").getAsJsonArray().get(i).getAsString() + "=" + j.get("inputs").getAsJsonArray().get(i).getAsString();
						}
					}
				}
			}
		}
		System.out.println("final url is " + u);
		URL url = new URL(u);
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
		return parser.parse(br);
	}
	private static int findNode(JsonArray ja, int id) throws Exception {
		System.out.println("Looking for " + id + "in a context of " + ja.size() + " nodes.");
		for(int i = 0; i < ja.size(); i++) {
			if(ja.get(i).getAsJsonObject().get("id").getAsInt() == id) return i;
		}
		throw new Exception("node not found!");
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
				if(rs.getBoolean(4)) {
					Gson gson = new Gson();
					return Response.status(200).entity("{\"failed\":true}").build();
				} else {
					return Response.status(200).entity(rs.getString(3)).build();
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
		} catch(Exception e) {
			StringWriter sw = new StringWriter();
			PrintWriter pw = new PrintWriter(sw);
			e.printStackTrace(pw);
			String sStackTrace = sw.toString(); // stack trace as a string
			return Response.status(500).entity(sStackTrace).build();
		}
	}
	private static JsonObject getService(int id) throws Exception {
		Connection conn = ConnectDB.getConnection();
		PreparedStatement p;
		p = conn.prepareStatement("select * from services where id=?;");
		p.setInt(1, id);
		ResultSet rs = p.executeQuery();
		if(rs.next()) {
			JsonObject ret = new JsonObject();
			ret.addProperty("id",rs.getInt(1));
			ret.addProperty("url",rs.getString(2));
			ret.addProperty("title", rs.getString(3));
			ret.addProperty("description", rs.getString(4));
			ret.addProperty("return", rs.getString(5));
			p = conn.prepareStatement("select value from serviceparameters where id=? order by i;");
			p.setInt(1, id);
			rs = p.executeQuery();
			ret.add("parameters", new JsonArray());
			while(rs.next()) {
				ret.get("parameters").getAsJsonArray().add(rs.getString(1));
			}
			return ret;
		} else {
			throw new Exception("No such service " + id);
		}
	}
	private static JsonObject getComposite(int id) throws Exception {
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
		ret.addProperty("description", rs.getString(2));
		ret.addProperty("composition", rs.getInt(3) > 0);
		int sid = rs.getInt(4);
		if(rs.wasNull()) {
			ret.add("service", JsonNull.INSTANCE) ;
		} else {
			ret.add("service", getService(sid));
		}
		ret.addProperty("compEdge",rs.getString(5));
		ret.add("children", new JsonArray());
		p = conn.prepareStatement("select childid from children where id=?;");
		p.setInt(1, id);
		rs = p.executeQuery();
		while(rs.next()) {
			ret.get("children").getAsJsonArray().add(getComposite(rs.getInt(1))); //recurse
		}
		ret.add("edges", new JsonArray());
		p = conn.prepareStatement("select * from edges where id=?;");
		p.setInt(1, id);
		rs = p.executeQuery();
		while(rs.next()) {
			JsonObject edge = new JsonObject();
			edge.addProperty("srcId",rs.getInt(2));
			edge.addProperty("paramNo",rs.getString(3));
			ret.get("edges").getAsJsonArray().add(edge);
		}
		ret.add("childEdges", new JsonArray());
		p = conn.prepareStatement("select * from childedges where id=?;");
		p.setInt(1, id);
		rs = p.executeQuery();
		while(rs.next()) {
			JsonObject edge = new JsonObject();
			edge.addProperty("destId",rs.getInt(2));
			edge.addProperty("paramNo",rs.getString(3));
			edge.addProperty("inputNo",rs.getString(4));
			ret.get("childEdges").getAsJsonArray().add(edge);
		}
		ret.add("inputs",new JsonArray());
		p = conn.prepareStatement("select * from inputs where id=? order by i;");
		p.setInt(1, id);
		rs = p.executeQuery();
		while(rs.next()) {
			ret.get("inputs").getAsJsonArray().add(rs.getString(3)); //parser sorts out what json primitive type our data is.
		}
		return ret;
	}
	@GET
	@Path("/list")
	@Produces("application/json")
	public static Response listComposite(String c) {
		return Response.status(200).build();
	}
	@GET
	@Path("/listservices")
	@Produces("application/json")
	public static Response listServices(String c) {
		Connection conn = ConnectDB.getConnection();
		PreparedStatement p;
		try {
			p = conn.prepareStatement("select id from services;");
			//this is less efficient than querying it all at once, but at the scale we're working at right now it's fine.
			ResultSet rs = p.executeQuery();
			JsonArray r = new JsonArray();
			while(rs.next()) {
				r.add(getService(rs.getInt(1)));
			}
			JsonObject res = new JsonObject();
			res.add("result", r);
			Gson gson = new GsonBuilder().serializeNulls().create();
			return Response.status(200).entity(gson.toJson(res)).build();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return Response.status(500).entity("{\"status\":\"An error occurred.\"}").build();
		}
	}
	@POST
	@Path("/bulkdel")
	public static Response del() {
		Connection conn = ConnectDB.getConnection();
		Statement s;
		try {
			s = conn.createStatement();
			s.execute("delete from children;");
			s.execute("delete from inputs;");
			s.execute("delete from childedges;");
			s.execute("delete from edges;");
			s.execute("delete from serviceparameters;");
			s.execute("delete from services;");
			s.execute("delete from nodes;");
			s.close();
			Class currentClass = new Object() { }.getClass().getEnclosingClass();
			ClassLoader classLoader = currentClass.getClassLoader();
			BufferedReader br = new BufferedReader(new InputStreamReader(classLoader.getResourceAsStream("ws.json")));
			JsonParser parser = new JsonParser();
			JsonArray ja = parser.parse(br).getAsJsonObject().get("obj").getAsJsonArray();
			for(int i = 0; i < ja.size(); i++) {
				try {
					addService(ja.get(i));
				} catch (Exception e) {
					e.printStackTrace();
					return Response.status(520).build();
				}
			}
			return Response.status(200).build();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return Response.status(500).build();
		}

	}
}