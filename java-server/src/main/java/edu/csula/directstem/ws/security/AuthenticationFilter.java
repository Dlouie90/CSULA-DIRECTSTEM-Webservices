package edu.csula.directstem.ws.security;

import java.io.IOException;

import javax.annotation.Priority;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;

import edu.csula.directstem.model.User;

@Secured
@Provider
@Priority(Priorities.AUTHENTICATION)
public class AuthenticationFilter implements ContainerRequestFilter {
  private static final String TOKEN_PREFIX = "Bearer ";

  @Override
  public void filter(ContainerRequestContext requestContext) throws IOException {
    // Get the Authorization header from the request
    String authorizationHeader =
        requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);

    // Validate the Authorization header
    if (!hasBearerToken(authorizationHeader)) {
      abortWithUnauthorized(requestContext);
      return;
    }

    // Extract the token from the Authorization header
    String token = authorizationHeader.substring(TOKEN_PREFIX.length()).trim();

    try {
      User user = Token.verify(token);
      if (user == null) {
        abortWithUnauthorized(requestContext);
      } else {
        requestContext.setProperty("user", user);
      }
    } catch (Exception e) {
      e.printStackTrace();
      requestContext.abortWith(
          Response.status(Response.Status.INTERNAL_SERVER_ERROR)
              .build());
    }
  }

  private boolean hasBearerToken(String authorizationHeader) {
    // Check if the Authorization header is valid
    // It must not be null and must be prefixed with "Bearer" plus a whitespace
    // Authentication scheme comparison must be case-insensitive
    return authorizationHeader != null && authorizationHeader.startsWith(TOKEN_PREFIX);
  }

  private void abortWithUnauthorized(ContainerRequestContext requestContext) {
    requestContext.abortWith(
        Response.status(Response.Status.UNAUTHORIZED)
            .build());
  }
}
