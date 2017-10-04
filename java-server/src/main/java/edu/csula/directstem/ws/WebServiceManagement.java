package edu.csula.directstem.ws;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import edu.csula.directstem.model.Graph;
import edu.csula.directstem.ws.security.Secured;

@Path("/ws")
public class WebServiceManagement {
	@POST
	@Secured
	@Path("/addws")
	@Consumes("application/json")
	public Response addWebService(String gs) { //adds or updates a ws
		BufferedWriter out = null;
		Gson gson = new Gson();
		JsonParser parser = new JsonParser();
		JsonObject g = (JsonObject) parser.parse(gs);
		try  
		{
			File f = new File(g.get("id").getAsString()+".json");
		    FileWriter fstream = new FileWriter(f, false); 
		    out = new BufferedWriter(fstream);
		    out.write(gson.toJson(g));
		}
		catch (IOException e)
		{
		    System.err.println("Error: " + e.getMessage());
		}
		finally
		{
		    if(out != null) {
		        try {
					out.close();
				} catch (IOException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
		    }
		}
		return Response.status(200).build();
	}
	@GET
	@Secured
	@Path("/callws")
	@Produces("application/json")
	public String callWebService(@QueryParam("ws") String webService) { //invokes a saved ws graph
		String someJson = "";
		String linebuffer = "";
		try {
			BufferedReader file = new BufferedReader(new FileReader(webService+".json"));
			linebuffer = file.readLine();
			while(linebuffer != null) {
				someJson += linebuffer;
				linebuffer = file.readLine();
			}
			file.close();
		} catch (FileNotFoundException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		JsonParser parser = new JsonParser();
		Gson gson = new Gson();
		JsonObject o = parser.parse(someJson).getAsJsonObject();
		Graph g;
		try {
			g = new Graph(o,null);
			return gson.toJson(g.getResult());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return null;
		}
	}
	@GET
	@Secured
	@Path("/ws")
	@Produces("application/json")
	public Response getWebService(@QueryParam("ws") String webService) {
		String someJson = "";
		String linebuffer = "";
		try {
			BufferedReader file = new BufferedReader(new FileReader(webService+".json"));
			linebuffer = file.readLine();
			while(linebuffer != null) {
				someJson += linebuffer;
				linebuffer = file.readLine();
			}
			file.close();
		} catch (FileNotFoundException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
			return Response.status(404).build(); //no such ws
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return Response.ok(someJson).build();
	}
	@GET
	@Secured
	@Path("/listservices")
	@Produces("application/json")
	public String getListServices() {
		File folder = new File(".");
		JsonArray ls = new JsonArray();
		for(File f : folder.listFiles()) {
			if(f.getName().endsWith(".json")) {
				ls.add(f.getName().substring(0, f.getName().length()-5));
			}
		}
		Gson gson = new Gson();
		return gson.toJson(ls);
	}
}
