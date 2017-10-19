package edu.csula.directstem.ws;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import edu.csula.directstem.ws.db.UserDatabase;

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
        jsonObject=UserDatabase.retrieveAll();

        return new Gson().toJson(jsonObject);
    }

    @POST
    @Path("/user")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String createUser(String user) {
        System.out.println("POST - Create a User");

        JsonObject userJsonObject = (JsonObject) parser.parse(user);
        String message=UserDatabase.createUser(userJsonObject);

        userJsonObject.addProperty("message", message);
        return new Gson().toJson(userJsonObject);
    }

    @POST
    @Path("/user/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String loginUser(String user) {
        System.out.println("POST - Login User");

        JsonObject userJsonObject = (JsonObject) parser.parse(user);

        userJsonObject=UserDatabase.loginUser(userJsonObject);
        return new Gson().toJson(userJsonObject);
    }

    @PUT
    @Path("/user/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public String updateUser(@PathParam("id") int id, String user) {
        System.out.println("PUT - update user by id: " + id);

        JsonObject userJsonObject = (JsonObject) parser.parse(user);
        userJsonObject=UserDatabase.updateUser(userJsonObject);

        return new Gson().toJson(userJsonObject);
    }


    @GET
    @Path("/user/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public String getUserById(@PathParam("id") int id) {
        System.out.println("GET - USER BY ID: " + id);

        JsonObject jsonObject = new JsonObject();
        jsonObject=UserDatabase.retrieveUser(id);
        return new Gson().toJson(jsonObject);
    }

    @DELETE
    @Path("/user/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public String deleteUserById(@PathParam("id") int id) {
        System.out.println("DELETE - USER BY ID: " + id);

        JsonObject jsonObject = new JsonObject();
        jsonObject=UserDatabase.deleteUser(id);
        return new Gson().toJson(jsonObject);
    }
}
