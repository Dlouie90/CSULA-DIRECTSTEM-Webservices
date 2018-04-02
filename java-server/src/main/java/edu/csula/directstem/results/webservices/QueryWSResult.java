package edu.csula.directstem.results.webservices;

import java.util.List;

import edu.csula.directstem.model.User;

public class QueryWSResult {
  private int time;
  private String url;
  private String response;
  
  public QueryWSResult(String url, int time, String response) {
	this.url = url;
	this.time = time;
	this.response = response;
  }
  
  public String getUrl() {
	return this.url;
  }
  
  public void setUrl(String url) {
	this.url = url;
  }
  
  public int getTime() {
	return this.time;
  }
  
  public void setTime(int time) {
	this.time = time;
  }
  
  public String getResponse() {
	return this.response;
  }
  
  public void setResponse(String response) {
	this.response = response;
  }
}
