package edu.vn.ev_wms;

public abstract class User {

    private String Username;
    private String Password;
    private String Role;
    private String Email;
    private String Phone;

    public User(){}

    public User(String Username, String Password, String Role)
    {
        this.Username = Username;
        this.Password = Password;
        this.Role = Role;
    }

    public String getUsername(){
        return this.Username;
    }

    public String getPassword(){
        return this.Password;
    }

    public String getRole(){
        return this.Role;
    }

    public void setUsername(String Username){
        this.Username = Username;
    }

    public void setPassword(String Password){
        this.Password = Password;
    }

    public void setRole(String Role){
        this.Role = Role;
    }
    

    public void login(){
    }

    public void logout(){
    }

}
