package edu.csula.directstem.results.webservices;

import java.util.List;

import edu.csula.directstem.model.User;

public class QueryWSResult {
  private int time;
  private String url;
  
  public QueryWSResult(String url, int time) {
	this.url = url;
	this.time = time;
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
}
