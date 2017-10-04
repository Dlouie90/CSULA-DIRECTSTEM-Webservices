package edu.csula.directstem.model;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class ServiceNode extends Node {
	private String webservice;
	public ServiceNode(JsonObject json, Graph context) throws Exception {
		super(json,context);
		this.webservice = json.get("url").getAsString();
	}
	public String getWebservice() {
		return webservice;
	}
	public void setWebservice(String webservice) {
		this.webservice = webservice;
	}
	@Override
	public JsonObject toJson() {
		JsonObject js = super.toJson();
		js.addProperty("type", "graph");
		js.addProperty("url",webservice);
		return js;
	}
	@Override
	public JsonElement getResult() {
		try {
		String temp = webservice;
		List<String> args = new ArrayList<String>();
		//let's build the url, because I'm too lazy to use Apache HTTPClient or similar.
		for(Edge e : this.getIn()) {
			if(e.isRealEdge()) {
				RealEdge re = (RealEdge) e;
				JsonElement js = re.getFrom().getResult();
				String[] out = re.getOutString().split("\\.");
				out = Arrays.copyOfRange(out, 1, out.length); //drop the first one, because it's the from node.
				for( String o : out ) {
					//we're not accessing any arrays here.
					js = js.getAsJsonObject().get(o);
					String[] arrs = o.split("\\[");
					if(arrs.length > 1) {
						for (String arr : arrs) {
							String index = arr.split("\\]")[0]; //get JUST the number.
							js = js.getAsJsonArray().get(Integer.parseInt(index));
						}
					}
				}
				args.add(e.getInString() + "=" + URLEncoder.encode(js.getAsString(), "UTF-8")); //This assumes inputs are simpletons. passing arrays or objects is certainly possible, but would require more work and thinking.
			} else if(e.isConstEdge()) {
				ConstEdge ce = (ConstEdge) e;
				args.add(ce.getInString() + "=" + URLEncoder.encode(ce.getConstVal(), "UTF-8"));
			}
		}
		if(args.size() >= 1) {
			temp += "?";
			for(String arg : args) {
				temp += arg + "&";
			}
			temp = temp.substring(0, temp.length()-1);
		}
		URL url = new URL(temp);
		//System.out.println("final URL: " + url);
		HttpURLConnection conn = (HttpURLConnection) url.openConnection();
		conn.setRequestMethod("GET");
		conn.setRequestProperty("Accept", "application/json");
		
		if (conn.getResponseCode() != 200) {
			throw new RuntimeException("Failed : HTTP error code : "
					+ conn.getResponseCode());
		}

		BufferedReader br = new BufferedReader(new InputStreamReader(
			(conn.getInputStream())));

		JsonParser parser = new JsonParser();
		return parser.parse(br);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	@Override
	public boolean isServiceNode() {
		return true;
	}
}
