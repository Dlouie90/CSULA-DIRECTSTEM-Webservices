package edu.csula.directstem.model;

public class Node {
    private int id;
    private int xPos;
    private int yPos;
    private String title;

    public Node(int id, int xPos, int yPos, String title) {
        this.id = id;
        this.xPos = xPos;
        this.yPos = yPos;
        this.title = title;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getxPos() {
        return xPos;
    }

    public void setxPos(int xPos) {
        this.xPos = xPos;
    }

    public int getyPos() {
        return yPos;
    }

    public void setyPos(int yPos) {
        this.yPos = yPos;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
