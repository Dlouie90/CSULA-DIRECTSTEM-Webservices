package edu.csula.directstem.ws.REST;

import com.google.gson.Gson;
import edu.csula.directstem.data.user.UserDatabase;
import edu.csula.directstem.model.User;
import edu.csula.directstem.results.user.*;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/users")
public class UserResource {
  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response getUsers() {
    System.out.println("GET - /users");

    GetUsersResult result = UserDatabase.getUsers();
    return Response
        .status(Response.Status.OK)
        .entity(new Gson().toJson(result))
        .build();
  }

  @GET
  @Path("/{id}")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getUserById(@PathParam("id") int id) {
    System.out.println("GET - /user/" + id);

    GetUserByIdResult result = UserDatabase.getUserById(id);
    return Response
        .status(Response.Status.OK)
        .entity(new Gson().toJson(result))
        .build();
  }

  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response createUser(String user) {
    System.out.println("POST - /users");

    User pendingUser = new Gson().fromJson(user, User.class);
    CreateUserResult result = UserDatabase.createUser(pendingUser);
    return Response
        .status(Response.Status.OK)
        .entity(new Gson().toJson(result))
        .build();
  }

  @DELETE
  @Path("/{id}")
  @Produces(MediaType.APPLICATION_JSON)
  public Response deleteUserById(@PathParam("id") int id) {
    System.out.println("DELETE - /users/" + id);

    DeleteUserByIdResult result = UserDatabase.deleteUser(id);
    return Response
        .status(Response.Status.OK)
        .entity(new Gson().toJson(result))
        .build();
  }

  @PUT
  @Path("/{id}")
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response updateUser(@PathParam("id") int id, String user) {
    System.out.println("PUT - /users/" + id);

    User updatedUser = new Gson().fromJson(user, User.class);
    UpdateUserResult result = UserDatabase.updateUser(updatedUser, id);
    return Response
        .status(Response.Status.OK)
        .entity(new Gson().toJson(result))
        .build();
  }
}
