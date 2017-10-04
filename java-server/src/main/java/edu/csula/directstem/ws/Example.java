
package edu.csula.directstem.ws;


import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.google.gson.Gson;


@Path("/numbers")
public class Example {
	
	//ex: http://localhost:8080/webservice/v1/numbers/random?num=10
    @GET
    @Path("/random")
    @Produces(MediaType.APPLICATION_JSON)
    public String getRand(@QueryParam("num") String msg) {
    	int num = 0;
    	try {
        	num = Integer.parseInt(msg);
    	}
    	catch (NumberFormatException e) {
    		return "[1,2,3]";
    	}
    	Gson gson = new Gson();
    	List<Integer> alist = new ArrayList<Integer>();
    	for(int i = 0; i < num; i++) {
    		alist.add((int) (100*Math.random()));
    	}
    	return gson.toJson(alist);
        //return gson.toJson(gson); //this is pretty neat.
    }
    @GET
    @Path("/add")
    @Produces(MediaType.APPLICATION_JSON)
    public String getAdd(@QueryParam("num1") int num1, @QueryParam("num2") int num2) {
    	System.out.println("adding " + num1 + " and " + num2);
    	Gson gson = new Gson();
    	return gson.toJson(num1+num2);
    }
    @GET
    @Path("/sub")
    @Produces(MediaType.APPLICATION_JSON)
    public String getSub(@QueryParam("num1") int num1, @QueryParam("num2") int num2) {
    	System.out.println("subtracting " + num1 + " and " + num2);
    	Gson gson = new Gson();
    	return gson.toJson(num1-num2);
    }
    @GET
    @Path("/mul")
    @Produces(MediaType.APPLICATION_JSON)
    public String getMul(@QueryParam("num1") int num1, @QueryParam("num2") int num2) {
    	System.out.println("multiplying " + num1 + " and " + num2);
    	Gson gson = new Gson();
    	return gson.toJson(num1*num2);
    }
    @GET
    @Path("/div")
    @Produces(MediaType.APPLICATION_JSON)
    public String getDiv(@QueryParam("num1") int num1, @QueryParam("num2") int num2) {
    	System.out.println("dividing " + num1 + " and " + num2);
    	Gson gson = new Gson();
    	return gson.toJson(num1/num2);
    }
    @GET
    @Path("/mod")
    @Produces(MediaType.APPLICATION_JSON)
    public String getMod(@QueryParam("num1") int num1, @QueryParam("num2") int num2) {
    	System.out.println("modding " + num1 + " and " + num2);
    	Gson gson = new Gson();
    	return gson.toJson(num1%num2);
    }
}
