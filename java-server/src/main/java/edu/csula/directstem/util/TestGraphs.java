//package edu.csula.directstem.util;
//
//import java.io.BufferedReader;
//import java.io.FileNotFoundException;
//import java.io.FileReader;
//import java.io.IOException;
//import java.io.InputStream;
//import java.text.ParseException;
//import java.text.SimpleDateFormat;
//import java.util.Set;
//
//import com.google.gson.Gson;
//import com.google.gson.JsonObject;
//import com.google.gson.JsonParser;
//
//public class TestGraphs {
//  public static void main(String args[]) {
//    String someJson = "";
//    String linebuffer = "";
//    try {
//      BufferedReader file = new BufferedReader(new FileReader("1491386270849.json"));
//      linebuffer = file.readLine();
//      while (linebuffer != null) {
//        someJson += linebuffer;
//        linebuffer = file.readLine();
//      }
//      file.close();
//    } catch (FileNotFoundException e1) {
//      // TODO Auto-generated catch block
//      e1.printStackTrace();
//    } catch (IOException e) {
//      // TODO Auto-generated catch block
//      e.printStackTrace();
//    }
//    JsonParser parser = new JsonParser();
//    Gson gson = new Gson();
//    JsonObject o = parser.parse(someJson).getAsJsonObject();
//    try {
//    } catch (Exception e) {
//      // TODO Auto-generated catch block
//      e.printStackTrace();
//    }
//  }
//}
