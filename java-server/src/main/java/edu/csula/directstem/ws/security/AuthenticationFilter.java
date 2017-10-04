package edu.csula.directstem.ws.security;

import javax.ws.rs.container.*;

import java.io.IOException;
import java.security.MessageDigest;

import javax.annotation.*;
import javax.ws.rs.*;
import javax.ws.rs.core.*;
import javax.ws.rs.ext.*;

import org.eclipse.persistence.internal.oxm.conversion.Base64;

import com.google.gson.Gson;



@Secured
@Provider
@Priority(Priorities.AUTHENTICATION)
public class AuthenticationFilter implements ContainerRequestFilter {

    private static final String AUTHENTICATION_SCHEME = "Bearer";

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {

        // Get the Authorization header from the request
        String authorizationHeader =
                requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);

        // Validate the Authorization header
        if (!isTokenBasedAuthentication(authorizationHeader)) {
            abortWithUnauthorized(requestContext);
            return;
        }

        // Extract the token from the Authorization header
        String token = authorizationHeader
                            .substring(AUTHENTICATION_SCHEME.length()).trim();

        try {

            // Validate the token
            validateToken(token);

        } catch (Exception e) {
        	e.printStackTrace();
            abortWithUnauthorized(requestContext);
        }
    }

    private boolean isTokenBasedAuthentication(String authorizationHeader) {

        // Check if the Authorization header is valid
        // It must not be null and must be prefixed with "Bearer" plus a whitespace
        // Authentication scheme comparison must be case-insensitive
        return authorizationHeader != null && authorizationHeader.toLowerCase()
                    .startsWith(AUTHENTICATION_SCHEME.toLowerCase() + " ");
    }

    private void abortWithUnauthorized(ContainerRequestContext requestContext) {

        // Abort the filter chain with a 401 status code
        // The "WWW-Authenticate" is sent along with the response
        requestContext.abortWith(
                Response.status(Response.Status.UNAUTHORIZED)
                        .header(HttpHeaders.WWW_AUTHENTICATE, AUTHENTICATION_SCHEME)
                        .build());
    }

    private void validateToken(String token) throws Exception {
    	Gson gson = new Gson();
    	String json = new String(Base64.base64Decode(token.getBytes()));
    	CredentialsWithToken c = gson.fromJson(json, CredentialsWithToken.class);
    	if (Long.parseLong(c.getValidUntil()) < System.currentTimeMillis()) {
    		throw new Exception("Token is Expired");
    	}
    	MessageDigest digest = MessageDigest.getInstance("MD5"); //NOTE: MD5 is bad and we should not use it long-term, but it comes with the default MessageDigest class.
		String saltedData = c.getUsername() + c.getValidUntil() + "T3mP0rarypR1v@tekeY!"; //this is probably also not ideal, but yeah.
		String hashedData = new String(Base64.base64Encode(digest.digest(saltedData.getBytes()))); 
		if (!hashedData.equals(c.getToken())) {
			throw new Exception("Token is invalid");
		}
        // Check if it was issued by the server and if it's not expired
        // Throw an Exception if the token is invalid
    }
}