package edu.csula.directstem.ws.WebSocket;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Scanner;
import java.util.Timer;
import java.util.TimerTask;
import java.util.logging.Logger;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLSocketFactory;
import javax.websocket.CloseReason;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.CloseReason.CloseCodes;
import javax.websocket.server.ServerEndpoint;

import com.google.gson.Gson;

import edu.csula.directstem.model.WebService;
import edu.csula.directstem.results.webservices.QueryWSResult;
import edu.csula.directstem.util.WSBenchmark;

// access at host + "/socket/performance"
@ServerEndpoint(value = "/socket/performance")
public class RTPerformanceEndpoint {
 
    private Logger logger = Logger.getLogger(this.getClass().getName());
    private ArrayList<Session> sessions;
    private ArrayList<Timer> timers;
 
    @OnOpen
    public void onOpen(Session session) {
        logger.info("Connected ... " + session.getId());
        
        boolean new_session = true;
        
        if(sessions == null)
    		sessions = new ArrayList<Session>();
        
        for(Session s : sessions) {
        	if(s.equals(session))
        		new_session = false;
        }
        
        if(new_session)
        	createSession(session);
    }
    
    private void createSession(final Session s) {
    	if(timers == null)
    		timers = new ArrayList<Timer>();
    	
    	sessions.add(s);
    	
    	Timer t = new Timer();
    	timers.add(t);
    }
    
    private void deleteSession(Session s) {
    	int index = sessions.indexOf(s);
    	
    	sessions.remove(s);
    	timers.get(index).cancel();
    	timers.get(index).purge();
    	timers.remove(index);
    }
 
    @OnMessage
    public void onMessage(String message, final Session session) {
    	System.out.println(message);
    	String ret = message;
    	
    	int index = sessions.indexOf(session);
    	Timer t = timers.get(index);
    	
    	final WebService ws = new Gson().fromJson(message, WebService.class);
    	
    	TimerTask task = new TimerTask() {
			@Override
			public void run() {
				try {
					QueryWSResult result = WSBenchmark.benchmark(ws);
					String msg = new Gson().toJson(result);
					session.getBasicRemote().sendText(msg);
				} catch (IOException e) {
					System.out.println(e.getMessage());
					e.printStackTrace();
				}
			}
		};
		
		t.scheduleAtFixedRate(task, 0, ws.getInterval());
    }
 
    @OnClose
    public void onClose(Session session, CloseReason closeReason) {
        logger.info(String.format("Session %s closed because of %s", session.getId(), closeReason));
        deleteSession(session);
    }
}