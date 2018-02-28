package edu.csula.directstem.model;

public class WebService {
	private String url;

    public WebService(String url) {
        this.url = url;
    }

    public String getUrl() {
        return this.url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
