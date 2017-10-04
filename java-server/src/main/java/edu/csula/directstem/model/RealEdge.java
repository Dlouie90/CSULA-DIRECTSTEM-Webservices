package edu.csula.directstem.model;

import com.google.gson.JsonObject;

public class RealEdge extends Edge {
	private Node from;
	private String outString;
	public RealEdge() {
	}
	public RealEdge(Node from, Node to) {
		this.from = from;
		this.setTo(to);
	}
	public RealEdge(Node from, Node to, String outString, String inString) {
		this.from = from;
		this.setTo(to);
		this.outString = outString;
		this.setInString(inString);
	}
	@Override
	public JsonObject toJson() {
		JsonObject js = super.toJson();
		js.addProperty("type", "real");
		js.addProperty("from", outString); 
		//no separate "from" added
		//the id of the from node is encoded in the outstring anyway.
		return js;
	}
	public Node getFrom() {
		return from;
	}
	public void setFrom(Node from) {
		this.from = from;
	}
	public String getOutString() {
		return outString;
	}
	public void setOutString(String outString) {
		this.outString = outString;
	}
	@Override
	public boolean isRealEdge() {
		return true;
	}

}
