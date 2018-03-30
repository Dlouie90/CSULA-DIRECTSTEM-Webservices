package edu.csula.directstem.util;

import java.io.BufferedWriter;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Scanner;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLSocketFactory;

import edu.csula.directstem.model.WebService;
import edu.csula.directstem.results.webservices.QueryWSResult;

public class WSBenchmark {
	public static QueryWSResult benchmark(WebService ws) {
    	QueryWSResult result = new QueryWSResult(ws.getUrl(), -1, "");
    	
        try {
        	boolean need_params = true;
        	boolean ssl = false;
        	
        	String url = ws.getUrl();
        	String method = ws.getMethod();
        	String[] keys = ws.getParam_keys();
        	String[] vals = ws.getParam_vals();
        	
        	// automagically detect a secure connection requirement
        	if(url.substring(0, 4).toLowerCase().equals("https"))
        		ssl = true;
        	
        	// reconstruct a GET request url string thing
        	if(method.equals("GET")) {
        		need_params = false;
        		url += "?";
        		for(int i=0; i<keys.length; i++) {
        			url += keys[i] + "=" + vals[i];
        			if(i<keys.length-1)
        				url += "&";
        		}
        	}
        	
        	System.out.println("sending a " + method + " request to " + url);
        	
        	long start = System.nanoTime();
        	HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
        	
        	if (ssl) {
        		SSLSocketFactory socketFactory = (SSLSocketFactory) SSLSocketFactory.getDefault();
        		((HttpsURLConnection) connection).setSSLSocketFactory(socketFactory);
        	}
        	
        	connection.setDoInput(true);
        	connection.setRequestMethod(method);
        	connection.setInstanceFollowRedirects(true);
        	connection.setRequestProperty("Content-Type","application/x-www-form-urlencoded");
        	connection.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.146 Safari/537.36");
        	
        	if(need_params) {
        		connection.setDoOutput(true);
        		
        		OutputStream os = connection.getOutputStream();
        		BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os, "UTF-8"));
        		writer.write(getQuery(keys, vals));
        		writer.flush();
        		writer.close();
        		os.close();
        		
        		connection.connect();
        	}
        	
        	//URLConnection connection = new URL(ws.getUrl()).openConnection();
        	InputStream response = connection.getInputStream();
        	
        	Scanner scanner = new Scanner(response);
        	String responseBody = scanner.useDelimiter("\\A").next();
        	scanner.close();
        	
        	long end = System.nanoTime();
     
        	int time = (int)(end - start);
        	result.setTime(time);
        	result.setResponse(responseBody);
        }
        catch(Exception e) {
        	// do something?
        	System.out.println(e.getMessage());
        }
        
        return result;
	}
	
	private static String getQuery(String[] keys, String[] vals) throws UnsupportedEncodingException
    {
        StringBuilder result = new StringBuilder();
        boolean first = true;

        for(int i=0; i<keys.length; i++)
        {
            if (first)
                first = false;
            else
                result.append("&");

            result.append(URLEncoder.encode(keys[i], "UTF-8"));
            result.append("=");
            result.append(URLEncoder.encode(vals[i], "UTF-8"));
        }

        return result.toString();
    }
}
