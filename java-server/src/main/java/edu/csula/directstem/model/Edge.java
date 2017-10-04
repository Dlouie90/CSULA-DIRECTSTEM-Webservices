package edu.csula.directstem.model;

import com.google.gson.JsonObject;

public class Edge {
	private Node to;
	private String inString;
	public Edge() {
		
	}
	public JsonObject toJson() {
		JsonObject js = new JsonObject();
		js.addProperty("name", inString);
		return js;
	}
	public Edge(Node to) {
		this.to = to;
	}
	public Node getTo() {
		return to;
	}
	public void setTo(Node to) {
		this.to = to;
	}
	public String getInString() {
		return inString;
	}
	public void setInString(String inString) {
		this.inString = inString;
	}
	public boolean isRealEdge() {
		return false;
	}
	public boolean isConstEdge() {
		return false;
	}
}
