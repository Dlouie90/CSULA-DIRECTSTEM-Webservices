package edu.csula.directstem.ws.WebSocket;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Timer;
import java.util.TimerTask;
import java.util.logging.Logger;
 
import javax.websocket.CloseReason;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.CloseReason.CloseCodes;
import javax.websocket.server.ServerEndpoint;
 
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
    public String onMessage(String message, final Session session) {
    	System.out.println(message);
    	String ret = message;
    	
    	int index = sessions.indexOf(session);
    	Timer t = timers.get(index);
    	
    	String[] msgs = message.split(" ");
    	
        switch (msgs[0]) {
        	case "measure":
        		logger.info("Measuring performance of a node");
        		
        		TimerTask task = new TimerTask() {
        			@Override
        			public void run() {
        				try {
        					session.getBasicRemote().sendText("result");
        				} catch (IOException e) {
        					System.out.println(e.getMessage());
        					e.printStackTrace();
        				}
        			}
        		};
        		
        		t.scheduleAtFixedRate(task, 0, 1000);
        		
        		ret = "measurement started";
        		break;
        }
        
        return ret;
    }
 
    @OnClose
    public void onClose(Session session, CloseReason closeReason) {
        logger.info(String.format("Session %s closed because of %s", session.getId(), closeReason));
        deleteSession(session);
    }
}