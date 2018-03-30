package edu.csula.directstem.ws.REST;
import com.google.gson.Gson;
import edu.csula.directstem.data.project.ProjectDatabase;
import edu.csula.directstem.model.Project;
import edu.csula.directstem.model.WebService;
import edu.csula.directstem.results.project.*;
import edu.csula.directstem.results.webservices.QueryWSResult;
import edu.csula.directstem.util.WSBenchmark;

import java.io.BufferedWriter;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.util.Scanner;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLSocketFactory;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/ws")
public class WebServiceResource {
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProjects() {
        System.out.println("GET - /ws");

        GetProjectResult result = ProjectDatabase.getProjects();
        return Response
                .status(Response.Status.OK)
                .build();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getProjectById(@PathParam("id") int id) {
        System.out.println("GET - /ws/" + id);

        // TODO: return a webservice object by its id
        GetProjectByIdResult result = ProjectDatabase.getProjectById(id);
        return Response
                .status(Response.Status.OK)
                .entity(new Gson().toJson(result))
                .build();
    }

    @POST
    @Path("/query")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response queryWS(String wsJSON) {
        System.out.println("POST - /ws/query");
        
        WebService ws = new Gson().fromJson(wsJSON, WebService.class);
        QueryWSResult result = WSBenchmark.benchmark(ws);

        return Response
                .status(Response.Status.OK)
                .entity(new Gson().toJson(result))
                .build();
    }
}
