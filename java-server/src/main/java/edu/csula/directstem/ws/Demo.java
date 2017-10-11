package edu.csula.directstem.ws;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;

@Path("/demo")
public class Demo {
    private JsonParser parser = new JsonParser();

    @GET
    @Path("/users")
    @Produces(MediaType.APPLICATION_JSON)
    public String getUsers() {
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("message", "get all users request");
        return new Gson().toJson(jsonObject);
    }

    @POST
    @Path("/user")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String createUser(String user) {
        System.out.println("POST - Create a User");

        JsonObject userJsonObject = (JsonObject) parser.parse(user);
        userJsonObject.addProperty("message", "POST - create user");
        return new Gson().toJson(userJsonObject);
    }

    @POST
    @Path("/user/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String loginUser(String user) {
        System.out.println("POST - Login User");

        JsonObject userJsonObject = (JsonObject) parser.parse(user);
        userJsonObject.addProperty("message", "POST - Login User");
        return new Gson().toJson(userJsonObject);
    }

    @PUT
    @Path("/user/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String updateUser(@PathParam("id") int id, String user) {
        System.out.println("PUT - update user by id: " + id);

        JsonObject userJsonObject = (JsonObject) parser.parse(user);
        userJsonObject.addProperty("message", "PUT - update user");
        return new Gson().toJson(userJsonObject);
    }


    @GET
    @Path("/user/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public String getUserById(@PathParam("id") int id) {
        System.out.println("GET - USER BY ID: " + id);

        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("message", "get user by id:" + id);
        return new Gson().toJson(jsonObject);
    }

    @DELETE
    @Path("/user/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public String deleteUserById(@PathParam("id") int id) {
        System.out.println("DELETE - USER BY ID: " + id);

        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("message", "delete user by id:" + id);
        return new Gson().toJson(jsonObject);
    }
}
