package edu.csula.directstem.model;

public class WebService {
	private String url;
	private String method;

    public WebService(String url, String method) {
        this.url = url;
        this.method = method;
    }

    public String getUrl() {
        return this.url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
    
    public String getMethod() {
    	return this.method;
    }
    
    public void setMethod(String method) {
    	this.method = method;
    }
}
