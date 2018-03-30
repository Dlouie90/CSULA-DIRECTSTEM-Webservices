package edu.csula.directstem.model;

public class WebService {
	private String url;
	private String method;
	private String[] param_keys;
	private String[] param_vals;
	private int interval;

    public WebService(String url, String method, String[] param_keys, String[] param_vals, int interval) {
        this.url = url;
        this.method = method;
        this.param_keys = param_keys;
        this.param_vals = param_vals;
        this.interval = interval;
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
    
    public String[] getParam_keys() {
    	return this.param_keys;
    }
    
    public void setParam_keys(String[] param_keys) {
    	this.param_keys= param_keys;
    }
    
    public String[] getParam_vals() {
    	return this.param_vals;
    }
    
    public void setParam_vals(String[] param_vals) {
    	this.param_vals= param_vals;
    }
    
    public int getInterval() {
    	return this.interval;
    }
    
    public void setInterval(int interval) {
    	this.interval = interval;
    }
}
