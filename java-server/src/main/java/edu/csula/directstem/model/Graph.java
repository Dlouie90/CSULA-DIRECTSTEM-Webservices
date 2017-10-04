package edu.csula.directstem.model;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;

public class Graph extends Node {
	private Set<Node> nodes;
	private Date timestamp;
	private String name;
	private Set<Node> outs;
	public Graph(JsonObject json, Graph context) throws Exception {
		super(json, context);
		nodes = new HashSet<Node>();
		if(json.has("timestamp")) this.timestamp = new java.util.Date(json.get("timestamp").getAsLong());
		if(json.has("name")) this.name = json.get("name").getAsString();
		if(json.has("nodes")) {
			for(JsonElement nod : json.get("nodes").getAsJsonArray()) {
				JsonObject node = nod.getAsJsonObject();
				//System.out.println("adding node " + node.get("id").getAsString()); 
				if(node.get("type").getAsString().equals("graph")) {
					//it's a graph.
					nodes.add(new Graph(node,this));
				} else if(node.get("type").getAsString().equals("service")) {
					//it's a service
					nodes.add(new ServiceNode(node,this));
				} else {
					//it's invalid? Let's at least parse it as a generic node.
					nodes.add(new Node(node,this));
				}
			}
		}
		outs = new HashSet<Node>();
		if(json.has("ends")) {
			for(JsonElement endId : json.get("ends").getAsJsonArray()) {
				//System.out.println("adding end " + endId.getAsString()); 
				outs.add(this.findNodeById(endId.getAsString()));
			}
		}
	}
	@Override
	public JsonObject toJson() {
		JsonObject js = super.toJson();
		js.addProperty("type", "graph");
		js.addProperty("timestamp", timestamp.getTime());
		js.addProperty("name", name);
		if(!outs.isEmpty()) {
			js.add("ends", new JsonArray());
			for (Node n : outs) {
				((JsonArray)js.get("ends")).add(n.getId());
			}
		}
		if(!nodes.isEmpty()) {
			js.add("nodes", new JsonArray());
			for (Node n : nodes) {
				((JsonArray)js.get("nodes")).add(n.toJson());
			}
		}
		return js;
	}
	public void addNode(Node node) {
		nodes.add(node);
	}
	public Set<Node> getNodes() {
		return nodes;
	}
	public void setNodes(Set<Node> nodes) {
		this.nodes = nodes;
	}
	public Date getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Node findNodeById(String id) {
		for (Node node : nodes) { //linear search. Really should be a hashmap eventually.
			if(node.isGraph()) {
				Node temp = ((Graph)node).findNodeById(id);
				if (temp != null) return temp;
			}
			if(id.equals(node.getId())) return node;
		}
		return null;
	}
	public Set<Node> getOuts() {
		return outs;
	}
	public void setOuts(Set<Node> outs) {
		this.outs = outs;
	}
	@Override
	public JsonElement getResult() {
		JsonArray res = new JsonArray();
		for(Node out : outs) {
			System.out.println(out);
			res.add(out.getResult());
		}
		return res;
	}
	@Override
	public boolean isGraph() {
		return true;
	}
}
