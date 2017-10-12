
package edu.csula.directstem.ws;


import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;


@Path("/numbers")
public class Example {
	
    @GET
    @Path("/random")
    @Produces(MediaType.APPLICATION_JSON)
    public String getRand(@QueryParam("num") String msg) {
    	int num = 0;
    	try {
        	num = Integer.parseInt(msg);
    	}
    	catch (NumberFormatException e) {
    		return "{\"result\":[1,2,3]}";
    	}
    	JsonArray alist = new JsonArray();
    	for(int i = 0; i < num; i++) {
    		alist.add((int) (100*Math.random()));
    	}
    	JsonObject ret = new JsonObject();
    	ret.add("result", alist);
    	Gson gson = new Gson();
    	return gson.toJson(ret);
    }
    @GET
    @Path("/add")
    public String getAdd(@QueryParam("num1") int num1, @QueryParam("num2") int num2) {
    	System.out.println("adding " + num1 + " and " + num2);
    	return Integer.toString(num1+num2);
    }
    @GET
    @Path("/sum")
    @Produces(MediaType.APPLICATION_JSON)
    public String getSum(@QueryParam("num1") int num1, @QueryParam("num2") int num2, @QueryParam("num3") int num3) {
    	System.out.println("adding " + num1 + " and " + num2 + " and " + num3);
    	JsonObject ret = new JsonObject();
    	ret.addProperty("result", num1+num2+num3);
    	Gson gson = new Gson();
    	return gson.toJson(ret);
    }
    @GET
    @Path("/increment")
    public String getIncrement(@QueryParam("num") int num) {
    	return Integer.toString(num+1);
    }
    @GET
    @Path("/invert")
    public String getInvert(@QueryParam("num") int num) {
    	return Integer.toString(-num);
    }
    @GET
    @Path("/sub")
    public String getSub(@QueryParam("num1") int num1, @QueryParam("num2") int num2) {
    	System.out.println("subtracting " + num1 + " and " + num2);
    	return Integer.toString(num1-num2);
    }
    @GET
    @Path("/mul")
    @Produces(MediaType.APPLICATION_JSON)
    public String getMul(@QueryParam("num1") int num1, @QueryParam("num2") int num2) {
    	System.out.println("multiplying " + num1 + " and " + num2);
    	JsonObject ret = new JsonObject();
    	ret.addProperty("result", num1*num2);
    	Gson gson = new Gson();
    	return gson.toJson(ret);
    }
    @GET
    @Path("/div")
    @Produces(MediaType.APPLICATION_JSON)
    public String getDiv(@QueryParam("num1") int num1, @QueryParam("num2") int num2) {
    	System.out.println("dividing " + num1 + " and " + num2);
    	JsonObject ret = new JsonObject();
    	ret.addProperty("result", num1/num2);
    	Gson gson = new Gson();
    	return gson.toJson(ret);
    }
    @GET
    @Path("/mod")
    @Produces(MediaType.APPLICATION_JSON)
    public String getMod(@QueryParam("num1") int num1, @QueryParam("num2") int num2) {
    	System.out.println("modding " + num1 + " and " + num2);
    	JsonObject ret = new JsonObject();
    	ret.addProperty("result", num1%num2);
    	Gson gson = new Gson();
    	return gson.toJson(ret);
    }
}
