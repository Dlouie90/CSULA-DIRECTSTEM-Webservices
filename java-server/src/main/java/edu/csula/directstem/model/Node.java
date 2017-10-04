package edu.csula.directstem.model;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;

public class Node {
	private Set<Edge> in;
	private String id;
	private Graph context; //used for building the network. Truly private.
	private boolean fullyInitialized; //are all of the neighbors in our edges initialized?
	public Node(JsonObject json, Graph context) {
		in = new HashSet<Edge>();
		fullyInitialized = true;
		this.context = context;
		if(json.has("id")) this.id=json.get("id").getAsString();
		if(json.has("params")) {
			JsonArray params = json.get("params").getAsJsonArray();
			for(JsonElement para : params) {
				JsonObject param = para.getAsJsonObject();
				if(param.get("type").getAsString().equals("real")) {
					RealEdge temp = new RealEdge();
					Node from = context.findNodeById(param.get("from").getAsString().split("\\.")[0]);
					if(from == null) {
						//we haven't parsed this node yet, or invalid node. We can always generate the from later, when we need it.
						fullyInitialized = false;
						temp.setOutString(param.get("from").getAsString());
					} else {
						temp.setFrom(from);
						temp.setOutString(param.get("from").getAsString());
					}
					temp.setInString(param.get("name").getAsString());
					in.add(temp);
				} else {
					//it's a const edge.
					ConstEdge temp = new ConstEdge();
					temp.setInString(param.get("name").getAsString());
					temp.setConstVal(param.get("value").getAsString());
					in.add(temp);
				}
			}
		}
	}
	public JsonObject toJson() {
		JsonObject js = new JsonObject();
		js.add("id", new JsonPrimitive(this.id));
		if(!in.isEmpty()) {
			js.add("params", new JsonArray());
			for(Edge e : in) {
				((JsonArray)js.get("params")).add(e.toJson());
			}
		}
		return js;
	}
	public Set<Edge> getIn() {
		if(!fullyInitialized) {
			fullyInitialized = true;
			for (Edge e : in) {
				if(e.isRealEdge()) {
					RealEdge re = (RealEdge) e;
					if( re.getFrom() == null) {
						re.setFrom(context.findNodeById(re.getOutString().split("\\.")[0]));
						if(re.getFrom() == null) {
							fullyInitialized = false; //bah, still not there! Probably gonna crash soonish.
						}
					}
				}
			}
		}
		return in;
	}
	public void setIn(Set<Edge> in) {
		this.in = in;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public JsonElement getResult() {
		return null; //Abstract Nodes do not produce anything.
	}
	public boolean isServiceNode() {
		return false;
	}
	public boolean isGraph() {
		return false;
	}
}
