package edu.csula.directstem.ws.REST;

import com.google.gson.Gson;
import edu.csula.directstem.data.project.ProjectDatabase;
import edu.csula.directstem.model.Project;
import edu.csula.directstem.results.project.*;

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

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProjectById(@PathParam("id") int id) {
        System.out.println("GET - /project/" + id);

        GetProjectByIdResult result = ProjectDatabase.getProjectById(id);
        return Response
                .status(Response.Status.OK)
                .entity(new Gson().toJson(result))
                .build();
    }

    @POST
    @Path("/add")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createProject(String project) {
        System.out.println("POST - /projects");

        Project pendingProject = new Gson().fromJson(project, Project.class);
        CreateProjectResult result = ProjectDatabase.createProject(pendingProject);
        return Response
                .status(Response.Status.OK)
                .entity(new Gson().toJson(result))
                .build();
    }

    @DELETE
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteProjectById(@PathParam("id") int id) {
        System.out.println("DELETE - /projects/" + id);

        DeleteProjectByIdResult result = ProjectDatabase.deleteProject(id);
        return Response
                .status(Response.Status.OK)
                .entity(new Gson().toJson(result))
                .build();
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateProject(@PathParam("id") int id, String project) {
        System.out.println("PUT - /projects/" + id);

        Project updatedProject = new Gson().fromJson(project, Project.class);
        UpdateProjectResult result = ProjectDatabase.updateProject(updatedProject, id);
        return Response
                .status(Response.Status.OK)
                .entity(new Gson().toJson(result))
                .build();
    }
}
