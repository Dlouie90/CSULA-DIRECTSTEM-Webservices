package edu.csula.directstem.ws.REST;

import com.google.gson.Gson;
import edu.csula.directstem.data.project.ProjectDatabase;
import edu.csula.directstem.results.GetProjectResult;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/projects")
public class ProjectResource {
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProjects() {
        System.out.println("GET - /projects");

        GetProjectResult result = ProjectDatabase.getProjects();
        return Response
                .status(Response.Status.OK)
                .entity(new Gson().toJson(result))
                .build();
    }
}
