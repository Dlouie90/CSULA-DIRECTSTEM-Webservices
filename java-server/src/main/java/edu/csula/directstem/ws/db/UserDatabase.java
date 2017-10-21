package edu.csula.directstem.ws.db;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;


import java.sql.Connection;
import java.sql.*;

public class UserDatabase {
    private static Connection connection = ConnectDB.getConnection();
    private static Statement statement = null;
    private static ResultSet resultSet = null;
    private static JsonParser parser=new JsonParser();

    //Create user
    public static String createUser(JsonObject jsonObject){
        String sql = "INSERT INTO Users (firstname, lastname, username, password, email) VALUES (?, ?, ?, ?, ?)";

        PreparedStatement statement;
        try {
            statement = connection.prepareStatement(sql);

            statement.setString(1,jsonObject.get("firstName").toString());
            statement.setString(2,jsonObject.get("lastName").toString());
            statement.setString(3,jsonObject.get("username").toString());
            statement.setString(4,jsonObject.get("email").toString());
            statement.setString(5,jsonObject.get("password").toString());
            statement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            return "SQL Error Occurred when Creating a user";
        }

        return "Created the user successfully";
    }

    public static JsonObject retrieveAll(){
        String sql="Select * From Users;";
        JsonObject object=new JsonObject();
        String users="";
        Statement statement;
        try{
            statement=connection.createStatement();
            ResultSet set=statement.executeQuery(sql);
            int amount =0;
            while(set.next()){
                users+="{\n";
                for(int i=1;i<set.getMetaData().getColumnCount();i++){
                    if(i+1>=set.getMetaData().getColumnCount()){
                        users+=set.getString(i)+"\n";
                    }
                    else{
                        users+=(set.getString(i)+",\n");
                    }

                }
                if(set.next()){
                    users+="},\n";
                    set.previous();
                }
                else{
                    users+="}\n";
                }
                amount++;

            }

            if(amount<=0){
                object.addProperty("message:","No users exist");
                return object;
            }
            System.out.println(users);
            object.addProperty("users:","[\n"+users+"]");
            object.addProperty("message:","Users returned");
            return object;
        }catch (SQLException e){
            e.printStackTrace();
            object.addProperty("message:","SQL Error Occurred When Retrieving all users");
            return object;
        }

    }

    private static String returnString(ResultSet set){

        return "";
    }
    public static JsonObject retrieveUser(int id){
        String selectQuery="Select id,firstname,lastname FROM Users where id=?";
        JsonObject object=new JsonObject();
        PreparedStatement selectStatement;
        try {
            int amount=0;
            selectStatement=connection.prepareStatement(selectQuery);
            selectStatement.setString(1,""+id);
            ResultSet set=selectStatement.executeQuery();
            while(set.next()){
                amount++;
            }

            if(amount<=0){
                object.addProperty("message:","Error: User Could not be found");
                return object;
            }
            set.previous();
            object.addProperty("id",set.getString(1));
            object.addProperty("firstname",set.getString(2));
            object.addProperty("lastname",set.getString(3));
            object.addProperty("message","Successfully found user");

            return object;
        } catch (SQLException e) {
            e.printStackTrace();
            object.addProperty("message:","SQL Error Occurred while retrieving user");
            return object;
        }
    }

    public static JsonObject updateUser(JsonObject jsonObject){
        String sql = "UPDATE users SET firstname = ?, lastname=? WHERE id = ?";

        JsonObject object=new JsonObject();
        PreparedStatement statement;
        try {
            statement = connection.prepareStatement(sql);

            statement.setString(1,jsonObject.get("firstName").toString());
            statement.setString(2,jsonObject.get("lastName").toString());
            statement.setString(3,jsonObject.get("id").toString());
            int row=statement.executeUpdate();

            if(row<=0){
                object.addProperty("message:","UserID Not Found");
                return object;
            }
            String selectQuery="Select id,firstname,lastname FROM Users where id=?";
            PreparedStatement selectStatement;
            selectStatement=connection.prepareStatement(selectQuery);
            selectStatement.setString(1,jsonObject.get("id").toString());
            ResultSet set=selectStatement.executeQuery();
            set.next();

            object.addProperty("id",set.getString(1));
            object.addProperty("firstname",set.getString(2));
            object.addProperty("lastname",set.getString(3));
            object.addProperty("message","Successfully updated user");

            return object;
        } catch (SQLException e) {
            e.printStackTrace();
            object.addProperty("message","SQL QUERY ERROR OCCURRED");
            return object;
        }
    }

    public static JsonObject deleteUser(int id){
        String sql = "DELETE FROM users WHERE id = ?";
        JsonObject object=new JsonObject();
        PreparedStatement statement;
        try {
            statement = connection.prepareStatement(sql);
            statement.setString(1, ""+id);

            int rowsDeleted = statement.executeUpdate();
            if (rowsDeleted > 0) {
                object.addProperty("Message:","User Deleted Successfully");
                return object;
            }

            object.addProperty("message:","User does not exist");
            return object;
        } catch (SQLException e) {
            e.printStackTrace();
            object.addProperty("message:","SQL Error occurred while deleting user");
            return object;
        }
    }

    public static JsonObject loginUser(JsonObject jsonObject){
        String sql="Select * from Users WHERE username=? and password=?";
        JsonObject object=new JsonObject();
        PreparedStatement statement;
        ResultSet row;
        int amount=0;
        try {
            statement = connection.prepareStatement(sql);
            statement.setString(1,jsonObject.get("username").toString());
            statement.setString(2,jsonObject.get("password").toString());
            row=statement.executeQuery();
            row.getMetaData().getColumnCount();


            while(row.next()){
                System.out.println(row.getString(1));
                amount++;
            }
            if(amount>0){
                row.previous();
                object.addProperty("firstname",row.getString(2));
                object.addProperty("lastname",row.getString(3));
                object.addProperty("username",row.getString(4));
                object.addProperty("email",row.getString(6));
                object.addProperty("message:","Login Successful");
                return object;
            }
            object.addProperty("message:","Login Unsuccesful");
            return object;
        }catch (SQLException e){
            e.printStackTrace();
            object.addProperty("message:","Login Credentials were incorrect");
            return object;
        }
    }
    private void close() { // close all potential resource leaks
        try {
            if (resultSet != null) {
                resultSet.close();
            }

            if (statement != null) {
                statement.close();
            }

            if (connection != null) {
                connection.close();
            }

        } catch (Exception e) {
        }
    }
}
