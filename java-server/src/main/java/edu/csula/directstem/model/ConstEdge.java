package edu.csula.directstem.model;

import com.google.gson.JsonObject;

public class ConstEdge extends Edge {
	private String constVal;
	public ConstEdge() {
		
	}
	public ConstEdge(Node to, String constVal) {
		this.constVal = constVal;
		this.setTo(to);
	}
	@Override
	public JsonObject toJson() {
		JsonObject js = super.toJson();
		js.addProperty("type", "const");
		js.addProperty("value", constVal);
		return js;
	}
	public String getConstVal() {
		return constVal;
	}
	public void setConstVal(String constVal) {
		this.constVal = constVal;
	}
	@Override
	public boolean isConstEdge() {
		return true;
	}
}
